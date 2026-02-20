import { prisma } from "@/lib/prisma";
import { requireManager, apiResponse, apiError, withErrorHandler } from "@/lib/api-helpers";
import { updateComplianceItemSchema } from "@/lib/validators";
import { publishEvent } from "@/lib/events";

export const GET = withErrorHandler(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const user = await requireManager();
  const { id } = await params;

  const item = await prisma.complianceItem.findFirst({
    where: { id, organizationId: user.organizationId! },
  });

  if (!item) return apiError("פריט לא נמצא", 404);
  return apiResponse(item);
});

export const PUT = withErrorHandler(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const user = await requireManager();
  const { id } = await params;
  const body = await req.json();
  const data = updateComplianceItemSchema.parse(body);

  const existing = await prisma.complianceItem.findFirst({
    where: { id, organizationId: user.organizationId! },
  });
  if (!existing) return apiError("פריט לא נמצא", 404);

  const item = await prisma.complianceItem.update({
    where: { id },
    data: {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate) : data.dueDate === null ? null : undefined,
      completedAt: data.completedAt ? new Date(data.completedAt) : data.completedAt === null ? null : undefined,
    },
  });

  await publishEvent({
    type: "compliance.updated",
    organizationId: user.organizationId!,
    entityId: id,
    userId: user.id,
    data: { status: item.status, name: item.name },
  });

  return apiResponse(item);
});
