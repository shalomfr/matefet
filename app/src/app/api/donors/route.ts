import { prisma } from "@/lib/prisma";
import { requireManager, requireAdmin, apiResponse, apiError, withErrorHandler, getAuthSession } from "@/lib/api-helpers";
import { createDonorSchema } from "@/lib/validators";
import { logAudit } from "@/lib/events";

export const GET = withErrorHandler(async (req: Request) => {
  const user = await getAuthSession();
  if (!user) return apiError("לא מחובר", 401);

  const { searchParams } = new URL(req.url);
  const orgId = user.role === "ADMIN"
    ? searchParams.get("organizationId") ?? undefined
    : user.organizationId;

  if (!orgId) return apiError("לא שויך לארגון", 400);

  const donors = await prisma.donor.findMany({
    where: { organizationId: orgId },
    orderBy: { createdAt: "desc" },
  });

  return apiResponse(donors);
});

export const POST = withErrorHandler(async (req: Request) => {
  const user = await requireManager();
  const body = await req.json();
  const data = createDonorSchema.parse(body);

  const donor = await prisma.donor.create({
    data: { ...data, organizationId: user.organizationId! },
  });

  await logAudit({
    organizationId: user.organizationId,
    userId: user.id,
    action: "create",
    entity: "donor",
    entityId: donor.id,
  });

  return apiResponse(donor, 201);
});
