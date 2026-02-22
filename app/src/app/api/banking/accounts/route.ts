import { prisma } from "@/lib/prisma";
import { requireManager, apiResponse, apiError, withErrorHandler } from "@/lib/api-helpers";
import { createBankAccountSchema } from "@/lib/validators";

export const GET = withErrorHandler(async () => {
  const user = await requireManager();
  const orgId = user.organizationId!;

  const accounts = await prisma.bankAccount.findMany({
    where: { organizationId: orgId },
    include: {
      _count: { select: { transactions: true } },
    },
    orderBy: [{ isPrimary: "desc" }, { bankName: "asc" }],
  });

  return apiResponse(accounts);
});

export const POST = withErrorHandler(async (req: Request) => {
  const user = await requireManager();
  const body = await req.json();
  const data = createBankAccountSchema.parse(body);

  const account = await prisma.bankAccount.create({
    data: {
      organizationId: user.organizationId!,
      bankName: data.bankName,
      bankCode: data.bankCode,
      branchNumber: data.branchNumber,
      accountNumber: data.accountNumber,
      iban: data.iban,
      balance: data.balance,
      availableBalance: data.availableBalance,
      isPrimary: data.isPrimary,
    },
  });

  return apiResponse(account, 201);
});
