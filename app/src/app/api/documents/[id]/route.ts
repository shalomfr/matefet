import { prisma } from "@/lib/prisma";
import { requireManager, apiResponse, apiError, withErrorHandler } from "@/lib/api-helpers";

export const GET = withErrorHandler(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const user = await requireManager();
  const { id } = await params;

  const doc = await prisma.organizationDocument.findFirst({
    where: { id, organizationId: user.organizationId! },
  });

  if (!doc) return apiError("מסמך לא נמצא", 404);
  return apiResponse(doc);
});

export const DELETE = withErrorHandler(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const user = await requireManager();
  const { id } = await params;

  const deleted = await prisma.organizationDocument.deleteMany({
    where: { id, organizationId: user.organizationId! },
  });

  if (deleted.count === 0) return apiError("מסמך לא נמצא", 404);
  return apiResponse({ deleted: true });
});
