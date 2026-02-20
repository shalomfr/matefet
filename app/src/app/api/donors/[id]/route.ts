import { prisma } from "@/lib/prisma";
import { requireManager, apiResponse, apiError, withErrorHandler } from "@/lib/api-helpers";
import { updateDonorSchema } from "@/lib/validators";
import { logAudit } from "@/lib/events";

export const GET = withErrorHandler(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const user = await requireManager();
  const { id } = await params;

  const donor = await prisma.donor.findFirst({
    where: { id, organizationId: user.organizationId! },
    include: { donations: { orderBy: { donatedAt: "desc" }, take: 20 } },
  });

  if (!donor) return apiError("תורם לא נמצא", 404);
  return apiResponse(donor);
});

export const PUT = withErrorHandler(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const user = await requireManager();
  const { id } = await params;
  const body = await req.json();
  const data = updateDonorSchema.parse(body);

  const donor = await prisma.donor.updateMany({
    where: { id, organizationId: user.organizationId! },
    data,
  });

  if (donor.count === 0) return apiError("תורם לא נמצא", 404);

  await logAudit({
    organizationId: user.organizationId,
    userId: user.id,
    action: "update",
    entity: "donor",
    entityId: id,
  });

  return apiResponse({ updated: true });
});

export const DELETE = withErrorHandler(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const user = await requireManager();
  const { id } = await params;

  const deleted = await prisma.donor.deleteMany({
    where: { id, organizationId: user.organizationId! },
  });

  if (deleted.count === 0) return apiError("תורם לא נמצא", 404);
  return apiResponse({ deleted: true });
});
