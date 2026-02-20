import { prisma } from "../prisma";
import { enqueueAutomation } from "../queue";
import { executeWorkflow } from "./engine";

export async function checkScheduledTasks() {
  const now = new Date();

  const tasks = await prisma.scheduledTask.findMany({
    where: {
      isActive: true,
      nextRunAt: { lte: now },
    },
  });

  for (const task of tasks) {
    if (!task.workflowId) continue;

    const workflow = await prisma.workflow.findUnique({
      where: { id: task.workflowId },
    });

    if (!workflow || workflow.status !== "ACTIVE") continue;

    const execution = await prisma.workflowExecution.create({
      data: {
        organizationId: task.organizationId,
        workflowId: workflow.id,
        status: "PENDING",
        triggerData: { scheduledTaskId: task.id, cron: task.cronExpression },
      },
    });

    await prisma.workflow.update({
      where: { id: workflow.id },
      data: { runCount: { increment: 1 }, lastRunAt: now },
    });

    const job = await enqueueAutomation({
      workflowId: workflow.id,
      executionId: execution.id,
      organizationId: task.organizationId,
    });

    if (!job) {
      await executeWorkflow(execution.id);
    }

    const nextRun = getNextCronRun(task.cronExpression);
    await prisma.scheduledTask.update({
      where: { id: task.id },
      data: { lastRunAt: now, nextRunAt: nextRun },
    });
  }

  return tasks.length;
}

export function getNextCronRun(cron: string): Date {
  const parts = cron.split(" ");
  if (parts.length !== 5) return new Date(Date.now() + 24 * 60 * 60 * 1000);

  const [minute, hour, dayOfMonth, , dayOfWeek] = parts;
  const now = new Date();
  const next = new Date(now);

  next.setMinutes(Number(minute) || 0);
  next.setHours(Number(hour) || 0);
  next.setSeconds(0);
  next.setMilliseconds(0);

  if (dayOfWeek !== "*") {
    const targetDay = Number(dayOfWeek);
    let daysUntil = targetDay - now.getDay();
    if (daysUntil <= 0) daysUntil += 7;
    next.setDate(now.getDate() + daysUntil);
  } else if (dayOfMonth !== "*") {
    next.setDate(Number(dayOfMonth));
    if (next <= now) {
      next.setMonth(next.getMonth() + 1);
    }
  } else if (next <= now) {
    next.setDate(next.getDate() + 1);
  }

  return next;
}
