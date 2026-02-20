import { prisma } from "@/lib/prisma";
import { requireManager, getAuthSession, apiResponse, apiError, withErrorHandler } from "@/lib/api-helpers";
import { createDonationSchema } from "@/lib/validators";
import { publishEvent, logAudit } from "@/lib/events";

export const GET = withErrorHandler(async (req: Request) => {
  const user = await getAuthSession();
  if (!user) return apiError("לא מחובר", 401);

  const { searchParams } = new URL(req.url);
  const orgId = user.role === "ADMIN"
    ? searchParams.get("organizationId") ?? undefined
    : user.organizationId;

  if (!orgId) return apiError("לא שויך לארגון", 400);

  const limit = Number(searchParams.get("limit") ?? 50);
  const status = searchParams.get("status") ?? undefined;

  const donations = await prisma.donation.findMany({
    where: {
      organizationId: orgId,
      ...(status ? { status: status as "PENDING" | "COMPLETED" | "CANCELLED" | "REFUNDED" } : {}),
    },
    include: { donor: true, campaign: true },
    orderBy: { donatedAt: "desc" },
    take: limit,
  });

  return apiResponse(donations);
});

export const POST = withErrorHandler(async (req: Request) => {
  const user = await requireManager();
  const body = await req.json();
  const data = createDonationSchema.parse(body);

  const donation = await prisma.donation.create({
    data: {
      organizationId: user.organizationId!,
      donorId: data.donorId,
      amount: data.amount,
      currency: data.currency,
      method: data.method,
      reference: data.reference,
      campaignId: data.campaignId,
      notes: data.notes,
      status: "COMPLETED",
      donatedAt: data.donatedAt ? new Date(data.donatedAt) : new Date(),
    },
    include: { donor: true },
  });

  // Update donor stats
  if (donation.donorId) {
    await prisma.donor.update({
      where: { id: donation.donorId },
      data: {
        totalDonated: { increment: donation.amount },
        donationCount: { increment: 1 },
        lastDonationAt: new Date(),
      },
    });
  }

  // Update campaign
  if (donation.campaignId) {
    await prisma.campaign.update({
      where: { id: donation.campaignId },
      data: { raisedAmount: { increment: donation.amount } },
    });
  }

  // Publish event for automation
  await publishEvent({
    type: "donation.created",
    organizationId: user.organizationId!,
    entityId: donation.id,
    userId: user.id,
    data: {
      amount: donation.amount,
      donorName: donation.donor ? `${donation.donor.firstName} ${donation.donor.lastName}` : "אנונימי",
      donorEmail: donation.donor?.email,
    },
  });

  await logAudit({
    organizationId: user.organizationId,
    userId: user.id,
    action: "create",
    entity: "donation",
    entityId: donation.id,
    details: { amount: donation.amount },
  });

  return apiResponse(donation, 201);
});
