import { prisma } from "@/lib/prisma";
import { requireManager, getAuthSession, apiResponse, apiError, withErrorHandler } from "@/lib/api-helpers";
import { createBudgetSchema } from "@/lib/validators";

export const GET = withErrorHandler(async (req: Request) => {
  const user = await getAuthSession();
  if (!user) return apiError("לא מחובר", 401);

  const orgId = user.role === "ADMIN"
    ? new URL(req.url).searchParams.get("organizationId") ?? undefined
    : user.organizationId;

  if (!orgId) return apiError("לא שויך לארגון", 400);

  const budgets = await prisma.budget.findMany({
    where: { organizationId: orgId },
    include: { lines: true },
    orderBy: { year: "desc" },
  });

  return apiResponse(budgets);
});

export const POST = withErrorHandler(async (req: Request) => {
  const user = await requireManager();
  const body = await req.json();
  const data = createBudgetSchema.parse(body);

  const budget = await prisma.budget.create({
    data: {
      organizationId: user.organizationId!,
      year: data.year,
      name: data.name,
      totalBudget: data.totalBudget,
    },
  });

  return apiResponse(budget, 201);
});
