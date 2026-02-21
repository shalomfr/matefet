import { prisma } from "@/lib/prisma";
import { requireManager, apiResponse, apiError, withErrorHandler } from "@/lib/api-helpers";

export const PUT = withErrorHandler(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const user = await requireManager();
  const { id } = await params;
  const body = await req.json();

  // Verify the budget line belongs to a budget owned by the user's org
  const line = await prisma.budgetLine.findFirst({
    where: { id },
    include: { budget: true },
  });

  if (!line || line.budget.organizationId !== user.organizationId) {
    return apiError("שורת תקציב לא נמצאה", 404);
  }

  const updated = await prisma.budgetLine.update({
    where: { id },
    data: {
      ...(body.category !== undefined ? { category: body.category } : {}),
      ...(body.planned !== undefined ? { planned: body.planned } : {}),
      ...(body.actual !== undefined ? { actual: body.actual } : {}),
    },
  });

  return apiResponse(updated);
});

export const DELETE = withErrorHandler(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const user = await requireManager();
  const { id } = await params;

  // Verify the budget line belongs to a budget owned by the user's org
  const line = await prisma.budgetLine.findFirst({
    where: { id },
    include: { budget: true },
  });

  if (!line || line.budget.organizationId !== user.organizationId) {
    return apiError("שורת תקציב לא נמצאה", 404);
  }

  await prisma.budgetLine.delete({ where: { id } });

  return apiResponse({ deleted: true });
});
