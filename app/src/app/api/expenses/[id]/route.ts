import { prisma } from "@/lib/prisma";
import { requireManager, apiResponse, apiError, withErrorHandler } from "@/lib/api-helpers";
import { updateExpenseSchema } from "@/lib/validators";

export const GET = withErrorHandler(async (_req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const user = await requireManager();
  const { id } = await params;

  const expense = await prisma.expense.findFirst({
    where: { id, organizationId: user.organizationId! },
    include: {
      bankAccount: { select: { bankName: true, accountNumber: true } },
      budgetLine: { select: { category: true, planned: true, actual: true } },
    },
  });

  if (!expense) return apiError("הוצאה לא נמצאה", 404);
  return apiResponse(expense);
});

export const PUT = withErrorHandler(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const user = await requireManager();
  const { id } = await params;
  const body = await req.json();
  const data = updateExpenseSchema.parse(body);

  const existing = await prisma.expense.findFirst({
    where: { id, organizationId: user.organizationId! },
  });
  if (!existing) return apiError("הוצאה לא נמצאה", 404);

  const expense = await prisma.$transaction(async (tx) => {
    const updateData: Record<string, unknown> = { ...data };
    if (data.expenseDate) updateData.expenseDate = new Date(data.expenseDate);

    // If status changed to PAID, set paidAt
    if (data.status === "PAID" && existing.status !== "PAID") {
      updateData.paidAt = new Date();
    }

    const updated = await tx.expense.update({
      where: { id },
      data: updateData,
    });

    // If budget line changed, adjust actuals
    if (data.budgetLineId && data.budgetLineId !== existing.budgetLineId) {
      // Remove from old budget line
      if (existing.budgetLineId) {
        const oldLine = await tx.budgetLine.update({
          where: { id: existing.budgetLineId },
          data: { actual: { decrement: existing.amount } },
          include: { budget: true },
        });
        await tx.budget.update({
          where: { id: oldLine.budgetId },
          data: { totalSpent: { decrement: existing.amount } },
        });
      }
      // Add to new budget line
      const newLine = await tx.budgetLine.update({
        where: { id: data.budgetLineId },
        data: { actual: { increment: updated.amount } },
        include: { budget: true },
      });
      await tx.budget.update({
        where: { id: newLine.budgetId },
        data: { totalSpent: { increment: updated.amount } },
      });
    }

    return updated;
  });

  return apiResponse(expense);
});

export const DELETE = withErrorHandler(async (_req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const user = await requireManager();
  const { id } = await params;

  const existing = await prisma.expense.findFirst({
    where: { id, organizationId: user.organizationId! },
  });
  if (!existing) return apiError("הוצאה לא נמצאה", 404);

  await prisma.$transaction(async (tx) => {
    // Remove from budget line if linked
    if (existing.budgetLineId) {
      const line = await tx.budgetLine.update({
        where: { id: existing.budgetLineId },
        data: { actual: { decrement: existing.amount } },
        include: { budget: true },
      });
      await tx.budget.update({
        where: { id: line.budgetId },
        data: { totalSpent: { decrement: existing.amount } },
      });
    }

    await tx.expense.delete({ where: { id } });
  });

  return apiResponse({ deleted: true });
});
