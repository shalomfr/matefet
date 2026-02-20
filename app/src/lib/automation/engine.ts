import { Prisma } from "@prisma/client";
import { prisma } from "../prisma";
import { AppEvent } from "../events";
import { enqueueAutomation } from "../queue";

export async function matchAndExecuteWorkflows(event: AppEvent) {
  const workflows = await prisma.workflow.findMany({
    where: {
      organizationId: event.organizationId,
      status: "ACTIVE",
      triggerType: "EVENT",
    },
    include: { steps: { orderBy: { order: "asc" } } },
  });

  for (const workflow of workflows) {
    const config = workflow.triggerConfig as Record<string, unknown> | null;
    if (!config?.eventType || config.eventType !== event.type) continue;

    if (config.conditions && !evaluateConditions(config.conditions as ConditionGroup, event.data ?? {})) {
      continue;
    }

    const execution = await prisma.workflowExecution.create({
      data: {
        organizationId: event.organizationId,
        workflowId: workflow.id,
        status: "PENDING",
        triggerData: event as unknown as Prisma.InputJsonValue,
      },
    });

    await prisma.workflow.update({
      where: { id: workflow.id },
      data: { runCount: { increment: 1 }, lastRunAt: new Date() },
    });

    const job = await enqueueAutomation({
      workflowId: workflow.id,
      executionId: execution.id,
      organizationId: event.organizationId,
      triggerData: event.data,
    });

    // No Redis — execute inline
    if (!job) {
      await executeWorkflow(execution.id);
    }
  }
}

export type ConditionGroup = {
  operator?: "AND" | "OR";
  rules?: Array<{
    field: string;
    op: "eq" | "neq" | "gt" | "lt" | "gte" | "lte" | "contains";
    value: unknown;
  }>;
};

export function evaluateConditions(
  conditions: ConditionGroup,
  data: Record<string, unknown>
): boolean {
  if (!conditions.rules || conditions.rules.length === 0) return true;

  const results = conditions.rules.map((rule) => {
    const fieldValue = data[rule.field];
    switch (rule.op) {
      case "eq": return fieldValue === rule.value;
      case "neq": return fieldValue !== rule.value;
      case "gt": return Number(fieldValue) > Number(rule.value);
      case "lt": return Number(fieldValue) < Number(rule.value);
      case "gte": return Number(fieldValue) >= Number(rule.value);
      case "lte": return Number(fieldValue) <= Number(rule.value);
      case "contains": return String(fieldValue).includes(String(rule.value));
      default: return true;
    }
  });

  return conditions.operator === "OR"
    ? results.some(Boolean)
    : results.every(Boolean);
}

export async function executeWorkflow(executionId: string) {
  const execution = await prisma.workflowExecution.findUnique({
    where: { id: executionId },
    include: { workflow: { include: { steps: { orderBy: { order: "asc" } } } } },
  });

  if (!execution) throw new Error(`Execution ${executionId} not found`);

  await prisma.workflowExecution.update({
    where: { id: executionId },
    data: { status: "RUNNING" },
  });

  try {
    const { executeAction } = await import("./actions");

    for (const step of execution.workflow.steps) {
      const stepLog = await prisma.executionStepLog.create({
        data: {
          executionId: execution.id,
          stepId: step.id,
          status: "RUNNING",
          input: step.actionConfig as Prisma.InputJsonValue,
        },
      });

      try {
        const result = await executeAction(step, {
          organizationId: execution.organizationId,
          triggerData: execution.triggerData as Record<string, unknown>,
        });

        await prisma.executionStepLog.update({
          where: { id: stepLog.id },
          data: { status: "SUCCESS", output: result as Prisma.InputJsonValue, completedAt: new Date() },
        });
      } catch (err) {
        await prisma.executionStepLog.update({
          where: { id: stepLog.id },
          data: { status: "FAILED", error: String(err), completedAt: new Date() },
        });
        throw err;
      }
    }

    await prisma.workflowExecution.update({
      where: { id: executionId },
      data: { status: "SUCCESS", completedAt: new Date() },
    });
  } catch (err) {
    await prisma.workflowExecution.update({
      where: { id: executionId },
      data: { status: "FAILED", error: String(err), completedAt: new Date() },
    });
  }
}
