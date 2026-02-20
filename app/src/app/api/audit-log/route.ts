import { prisma } from "@/lib/prisma";
import { getAuthSession, apiResponse, apiError, withErrorHandler } from "@/lib/api-helpers";

export const GET = withErrorHandler(async (req: Request) => {
  const user = await getAuthSession();
  if (!user) return apiError("לא מחובר", 401);

  const { searchParams } = new URL(req.url);
  const orgId = user.role === "ADMIN"
    ? searchParams.get("organizationId") ?? undefined
    : user.organizationId;

  const limit = Number(searchParams.get("limit") ?? 50);
  const entity = searchParams.get("entity") ?? undefined;

  const logs = await prisma.auditLog.findMany({
    where: {
      ...(orgId ? { organizationId: orgId } : {}),
      ...(entity ? { entity } : {}),
    },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return apiResponse(logs);
});
