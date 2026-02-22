import { prisma } from "@/lib/prisma";
import { requireAdmin, apiResponse, apiError, withErrorHandler } from "@/lib/api-helpers";
import { updateAdminEventSchema } from "@/lib/validators";
import { logAudit } from "@/lib/events";

export const GET = withErrorHandler(async (_req: Request, { params }: { params: Promise<{ id: string }> }) => {
  await requireAdmin();
  const { id } = await params;

  const event = await prisma.adminEvent.findUnique({
    where: { id },
    include: { organization: { select: { id: true, name: true } } },
  });

  if (!event) return apiError("אירוע לא נמצא", 404);
  return apiResponse(event);
});

export const PUT = withErrorHandler(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const user = await requireAdmin();
  const { id } = await params;
  const body = await req.json();
  const data = updateAdminEventSchema.parse(body);

  const existing = await prisma.adminEvent.findUnique({ where: { id } });
  if (!existing) return apiError("אירוע לא נמצא", 404);

  const updateData: Record<string, unknown> = { ...data };
  if (data.date) updateData.date = new Date(data.date);
  if (data.endDate) updateData.endDate = new Date(data.endDate);

  const event = await prisma.adminEvent.update({
    where: { id },
    data: updateData,
    include: { organization: { select: { id: true, name: true } } },
  });

  await logAudit({
    organizationId: existing.organizationId,
    userId: user.id,
    action: "update",
    entity: "adminEvent",
    entityId: id,
  });

  return apiResponse(event);
});

export const DELETE = withErrorHandler(async (_req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const user = await requireAdmin();
  const { id } = await params;

  const existing = await prisma.adminEvent.findUnique({ where: { id } });
  if (!existing) return apiError("אירוע לא נמצא", 404);

  await prisma.adminEvent.delete({ where: { id } });

  await logAudit({
    organizationId: existing.organizationId,
    userId: user.id,
    action: "delete",
    entity: "adminEvent",
    entityId: id,
  });

  return apiResponse({ deleted: true });
});
