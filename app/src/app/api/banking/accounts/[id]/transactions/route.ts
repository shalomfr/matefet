import { prisma } from "@/lib/prisma";
import { requireManager, apiResponse, apiError, withErrorHandler } from "@/lib/api-helpers";

export const GET = withErrorHandler(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const user = await requireManager();
  const { id } = await params;
  const url = new URL(req.url);

  const account = await prisma.bankAccount.findFirst({
    where: { id, organizationId: user.organizationId! },
  });
  if (!account) return apiError("חשבון לא נמצא", 404);

  const dateFrom = url.searchParams.get("from");
  const dateTo = url.searchParams.get("to");
  const direction = url.searchParams.get("direction");

  const where: Record<string, unknown> = { bankAccountId: id };
  if (dateFrom || dateTo) {
    where.valueDate = {};
    if (dateFrom) (where.valueDate as Record<string, unknown>).gte = new Date(dateFrom);
    if (dateTo) (where.valueDate as Record<string, unknown>).lte = new Date(dateTo);
  }
  if (direction) where.direction = direction;

  const transactions = await prisma.bankTransaction.findMany({
    where,
    orderBy: { valueDate: "desc" },
    take: 100,
  });

  return apiResponse(transactions);
});
