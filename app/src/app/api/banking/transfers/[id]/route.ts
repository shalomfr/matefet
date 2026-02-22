import { prisma } from "@/lib/prisma";
import { requireManager, apiResponse, apiError, withErrorHandler } from "@/lib/api-helpers";

export const GET = withErrorHandler(async (_req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const user = await requireManager();
  const { id } = await params;

  const transfer = await prisma.bankTransfer.findFirst({
    where: { id, organizationId: user.organizationId! },
    include: {
      fromAccount: { select: { bankName: true, accountNumber: true, branchNumber: true } },
      toAccount: { select: { bankName: true, accountNumber: true, branchNumber: true } },
    },
  });

  if (!transfer) return apiError("העברה לא נמצאה", 404);
  return apiResponse(transfer);
});
