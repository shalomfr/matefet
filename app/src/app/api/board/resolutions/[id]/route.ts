import { prisma } from "@/lib/prisma";
import { requireManager, apiResponse, apiError, withErrorHandler } from "@/lib/api-helpers";

export const GET = withErrorHandler(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const user = await requireManager();
  const { id } = await params;

  const resolution = await prisma.boardResolution.findFirst({
    where: { id, organizationId: user.organizationId! },
    include: { meeting: true },
  });

  if (!resolution) return apiError("החלטה לא נמצאה", 404);
  return apiResponse(resolution);
});

export const PUT = withErrorHandler(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const user = await requireManager();
  const { id } = await params;
  const body = await req.json();

  const existing = await prisma.boardResolution.findFirst({
    where: { id, organizationId: user.organizationId! },
  });
  if (!existing) return apiError("החלטה לא נמצאה", 404);

  const resolution = await prisma.boardResolution.update({
    where: { id },
    data: {
      ...(body.title !== undefined ? { title: body.title } : {}),
      ...(body.description !== undefined ? { description: body.description } : {}),
      ...(body.status !== undefined ? { status: body.status } : {}),
      ...(body.votesFor !== undefined ? { votesFor: body.votesFor } : {}),
      ...(body.votesAgainst !== undefined ? { votesAgainst: body.votesAgainst } : {}),
      ...(body.votesAbstain !== undefined ? { votesAbstain: body.votesAbstain } : {}),
    },
  });

  return apiResponse(resolution);
});

export const DELETE = withErrorHandler(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const user = await requireManager();
  const { id } = await params;

  const deleted = await prisma.boardResolution.deleteMany({
    where: { id, organizationId: user.organizationId! },
  });

  if (deleted.count === 0) return apiError("החלטה לא נמצאה", 404);
  return apiResponse({ deleted: true });
});
