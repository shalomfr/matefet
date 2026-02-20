import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireManager, apiResponse, apiError, withErrorHandler } from "@/lib/api-helpers";
import { updateWorkflowSchema } from "@/lib/validators";

export const GET = withErrorHandler(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const user = await requireManager();
  const { id } = await params;

  const workflow = await prisma.workflow.findFirst({
    where: { id, organizationId: user.organizationId! },
    include: {
      steps: { orderBy: { order: "asc" } },
      executions: { orderBy: { startedAt: "desc" }, take: 10 },
    },
  });

  if (!workflow) return apiError("אוטומציה לא נמצאה", 404);
  return apiResponse(workflow);
});

export const PUT = withErrorHandler(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const user = await requireManager();
  const { id } = await params;
  const body = await req.json();
  const data = updateWorkflowSchema.parse(body);

  const existing = await prisma.workflow.findFirst({
    where: { id, organizationId: user.organizationId! },
  });
  if (!existing) return apiError("אוטומציה לא נמצאה", 404);

  // If steps provided, delete old and recreate
  if (data.steps) {
    await prisma.workflowStep.deleteMany({ where: { workflowId: id } });
  }

  const workflow = await prisma.workflow.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      triggerType: data.triggerType,
      triggerConfig: data.triggerConfig as Prisma.InputJsonValue | undefined,
      status: data.status,
      steps: data.steps
        ? {
            create: data.steps.map((s) => ({
              order: s.order,
              actionType: s.actionType,
              actionConfig: (s.actionConfig ?? {}) as Prisma.InputJsonValue,
              conditionConfig: (s.conditionConfig ?? {}) as Prisma.InputJsonValue,
            })),
          }
        : undefined,
    },
    include: { steps: true },
  });

  return apiResponse(workflow);
});

export const DELETE = withErrorHandler(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const user = await requireManager();
  const { id } = await params;

  const deleted = await prisma.workflow.deleteMany({
    where: { id, organizationId: user.organizationId! },
  });

  if (deleted.count === 0) return apiError("אוטומציה לא נמצאה", 404);
  return apiResponse({ deleted: true });
});
