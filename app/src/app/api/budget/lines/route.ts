import { prisma } from "@/lib/prisma";
import { requireManager, apiResponse, apiError, withErrorHandler } from "@/lib/api-helpers";
import { createBudgetLineSchema } from "@/lib/validators";

export const GET = withErrorHandler(async (req: Request) => {
  const user = await requireManager();
  const { searchParams } = new URL(req.url);
  const budgetId = searchParams.get("budgetId");

  if (!budgetId) return apiError("budgetId נדרש", 400);

  const budget = await prisma.budget.findFirst({
    where: { id: budgetId, organizationId: user.organizationId! },
  });
  if (!budget) return apiError("תקציב לא נמצא", 404);

  const lines = await prisma.budgetLine.findMany({
    where: { budgetId },
    orderBy: { category: "asc" },
  });

  return apiResponse(lines);
});

export const POST = withErrorHandler(async (req: Request) => {
  const user = await requireManager();
  const body = await req.json();
  const data = createBudgetLineSchema.parse(body);

  // Verify budget belongs to org
  const budget = await prisma.budget.findFirst({
    where: { id: data.budgetId, organizationId: user.organizationId! },
  });
  if (!budget) return apiError("תקציב לא נמצא", 404);

  const line = await prisma.budgetLine.create({ data });

  return apiResponse(line, 201);
});
