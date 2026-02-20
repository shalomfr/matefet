import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireManager, requireAdmin, getAuthSession, apiResponse, apiError, withErrorHandler } from "@/lib/api-helpers";
import { createWorkflowSchema } from "@/lib/validators";
import { logAudit } from "@/lib/events";

export const GET = withErrorHandler(async (req: Request) => {
  const user = await getAuthSession();
  if (!user) return apiError("לא מחובר", 401);

  const { searchParams } = new URL(req.url);
  const orgId = user.role === "ADMIN"
    ? searchParams.get("organizationId") ?? undefined
    : user.organizationId;

  const workflows = await prisma.workflow.findMany({
    where: orgId ? { organizationId: orgId } : {},
    include: {
      steps: { orderBy: { order: "asc" } },
      _count: { select: { executions: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return apiResponse(workflows);
});

export const POST = withErrorHandler(async (req: Request) => {
  const user = await requireManager();
  const body = await req.json();
  const data = createWorkflowSchema.parse(body);

  const workflow = await prisma.workflow.create({
    data: {
      organizationId: user.organizationId!,
      name: data.name,
      description: data.description,
      triggerType: data.triggerType,
      triggerConfig: (data.triggerConfig ?? {}) as Prisma.InputJsonValue,
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

  await logAudit({
    organizationId: user.organizationId,
    userId: user.id,
    action: "create",
    entity: "workflow",
    entityId: workflow.id,
  });

  return apiResponse(workflow, 201);
});
