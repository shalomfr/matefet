import { prisma } from "@/lib/prisma";
import { requireManager, apiResponse, apiError, withErrorHandler } from "@/lib/api-helpers";
import { enqueueAutomation } from "@/lib/queue";

export const POST = withErrorHandler(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const user = await requireManager();
  const { id } = await params;

  const workflow = await prisma.workflow.findFirst({
    where: { id, organizationId: user.organizationId! },
    include: { steps: true },
  });

  if (!workflow) return apiError("אוטומציה לא נמצאה", 404);
  if (workflow.steps.length === 0) return apiError("אין צעדים באוטומציה", 400);

  const execution = await prisma.workflowExecution.create({
    data: {
      organizationId: user.organizationId!,
      workflowId: workflow.id,
      status: "PENDING",
      triggerData: { manualTrigger: true, userId: user.id },
    },
  });

  await prisma.workflow.update({
    where: { id: workflow.id },
    data: { runCount: { increment: 1 }, lastRunAt: new Date() },
  });

  // Try to queue, or execute inline if no Redis
  const job = await enqueueAutomation({
    workflowId: workflow.id,
    executionId: execution.id,
    organizationId: user.organizationId!,
  });

  if (!job) {
    // No Redis — execute inline
    const { executeWorkflow } = await import("@/lib/automation/engine");
    await executeWorkflow(execution.id);
  }

  return apiResponse({ executionId: execution.id, queued: !!job });
});
