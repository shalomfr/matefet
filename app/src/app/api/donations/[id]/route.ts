import { prisma } from "@/lib/prisma";
import { requireManager, apiResponse, apiError, withErrorHandler } from "@/lib/api-helpers";
import { updateDonationSchema } from "@/lib/validators";

export const GET = withErrorHandler(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const user = await requireManager();
  const { id } = await params;

  const donation = await prisma.donation.findFirst({
    where: { id, organizationId: user.organizationId! },
    include: { donor: true, campaign: true, receipt: true },
  });

  if (!donation) return apiError("תרומה לא נמצאה", 404);
  return apiResponse(donation);
});

export const PUT = withErrorHandler(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const user = await requireManager();
  const { id } = await params;
  const body = await req.json();
  const data = updateDonationSchema.parse(body);

  const result = await prisma.donation.updateMany({
    where: { id, organizationId: user.organizationId! },
    data,
  });

  if (result.count === 0) return apiError("תרומה לא נמצאה", 404);
  return apiResponse({ updated: true });
});
