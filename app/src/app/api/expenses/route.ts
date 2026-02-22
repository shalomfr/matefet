import { prisma } from "@/lib/prisma";
import { requireManager, apiResponse, withErrorHandler } from "@/lib/api-helpers";
import { createExpenseSchema } from "@/lib/validators";

export const GET = withErrorHandler(async (req: Request) => {
  const user = await requireManager();
  const orgId = user.organizationId!;
  const url = new URL(req.url);

  const category = url.searchParams.get("category");
  const status = url.searchParams.get("status");

  const where: Record<string, unknown> = { organizationId: orgId };
  if (category) where.category = category;
  if (status) where.status = status;

  const expenses = await prisma.expense.findMany({
    where,
    include: {
      bankAccount: { select: { bankName: true, accountNumber: true } },
      budgetLine: { select: { category: true, planned: true, actual: true } },
    },
    orderBy: { expenseDate: "desc" },
  });

  return apiResponse(expenses);
});

export const POST = withErrorHandler(async (req: Request) => {
  const user = await requireManager();
  const body = await req.json();
  const data = createExpenseSchema.parse(body);

  // Create expense and update budget line if linked
  const expense = await prisma.$transaction(async (tx) => {
    const created = await tx.expense.create({
      data: {
        organizationId: user.organizationId!,
        amount: data.amount,
        description: data.description,
        category: data.category,
        vendor: data.vendor,
        expenseDate: new Date(data.expenseDate),
        receiptUrl: data.receiptUrl,
        invoiceNumber: data.invoiceNumber,
        bankAccountId: data.bankAccountId,
        budgetLineId: data.budgetLineId,
      },
    });

    // Update budget line actual amount if linked
    if (data.budgetLineId) {
      const budgetLine = await tx.budgetLine.update({
        where: { id: data.budgetLineId },
        data: { actual: { increment: data.amount } },
        include: { budget: true },
      });

      // Update budget totalSpent
      await tx.budget.update({
        where: { id: budgetLine.budgetId },
        data: { totalSpent: { increment: data.amount } },
      });
    }

    return created;
  });

  return apiResponse(expense, 201);
});
