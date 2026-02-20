import { prisma } from "@/lib/prisma";
import { getAuthSession, apiResponse, apiError, withErrorHandler } from "@/lib/api-helpers";

export const GET = withErrorHandler(async (req: Request) => {
  const user = await getAuthSession();
  if (!user) return apiError("לא מחובר", 401);

  const { searchParams } = new URL(req.url);
  const orgId = user.role === "ADMIN"
    ? searchParams.get("organizationId") ?? undefined
    : user.organizationId;

  const workflowId = searchParams.get("workflowId") ?? undefined;
  const limit = Number(searchParams.get("limit") ?? 50);

  const executions = await prisma.workflowExecution.findMany({
    where: {
      ...(orgId ? { organizationId: orgId } : {}),
      ...(workflowId ? { workflowId } : {}),
    },
    include: {
      workflow: { select: { name: true, triggerType: true } },
      stepLogs: {
        include: { step: { select: { actionType: true, order: true } } },
        orderBy: { startedAt: "asc" },
      },
    },
    orderBy: { startedAt: "desc" },
    take: limit,
  });

  return apiResponse(executions);
});
