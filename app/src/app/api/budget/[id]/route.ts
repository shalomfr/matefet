import { prisma } from "@/lib/prisma";
import { requireManager, apiResponse, apiError, withErrorHandler } from "@/lib/api-helpers";

export const GET = withErrorHandler(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const user = await requireManager();
  const { id } = await params;

  const budget = await prisma.budget.findFirst({
    where: { id, organizationId: user.organizationId! },
    include: { lines: true },
  });

  if (!budget) return apiError("תקציב לא נמצא", 404);
  return apiResponse(budget);
});

export const PUT = withErrorHandler(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const user = await requireManager();
  const { id } = await params;
  const body = await req.json();

  const existing = await prisma.budget.findFirst({
    where: { id, organizationId: user.organizationId! },
  });
  if (!existing) return apiError("תקציב לא נמצא", 404);

  const budget = await prisma.budget.update({
    where: { id },
    data: {
      ...(body.name !== undefined ? { name: body.name } : {}),
      ...(body.year !== undefined ? { year: body.year } : {}),
      ...(body.totalBudget !== undefined ? { totalBudget: body.totalBudget } : {}),
      ...(body.totalSpent !== undefined ? { totalSpent: body.totalSpent } : {}),
      ...(body.isActive !== undefined ? { isActive: body.isActive } : {}),
    },
  });

  return apiResponse(budget);
});

export const DELETE = withErrorHandler(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const user = await requireManager();
  const { id } = await params;

  const deleted = await prisma.budget.deleteMany({
    where: { id, organizationId: user.organizationId! },
  });

  if (deleted.count === 0) return apiError("תקציב לא נמצא", 404);
  return apiResponse({ deleted: true });
});
