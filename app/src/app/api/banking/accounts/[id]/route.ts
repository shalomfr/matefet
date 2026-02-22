import { prisma } from "@/lib/prisma";
import { requireManager, apiResponse, apiError, withErrorHandler } from "@/lib/api-helpers";
import { updateBankAccountSchema } from "@/lib/validators";

export const GET = withErrorHandler(async (_req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const user = await requireManager();
  const { id } = await params;

  const account = await prisma.bankAccount.findFirst({
    where: { id, organizationId: user.organizationId! },
    include: { _count: { select: { transactions: true, transfersFrom: true } } },
  });

  if (!account) return apiError("חשבון לא נמצא", 404);
  return apiResponse(account);
});

export const PUT = withErrorHandler(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const user = await requireManager();
  const { id } = await params;
  const body = await req.json();
  const data = updateBankAccountSchema.parse(body);

  const existing = await prisma.bankAccount.findFirst({
    where: { id, organizationId: user.organizationId! },
  });
  if (!existing) return apiError("חשבון לא נמצא", 404);

  const account = await prisma.bankAccount.update({
    where: { id },
    data,
  });

  return apiResponse(account);
});

export const DELETE = withErrorHandler(async (_req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const user = await requireManager();
  const { id } = await params;

  const existing = await prisma.bankAccount.findFirst({
    where: { id, organizationId: user.organizationId! },
  });
  if (!existing) return apiError("חשבון לא נמצא", 404);

  await prisma.bankAccount.delete({ where: { id } });
  return apiResponse({ deleted: true });
});
