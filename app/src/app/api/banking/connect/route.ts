import { prisma } from "@/lib/prisma";
import { requireAuth, apiResponse, apiError, withErrorHandler } from "@/lib/api-helpers";
import { getFinandaService } from "@/lib/finanda";

export const GET = withErrorHandler(async (req: Request) => {
  const user = await requireAuth();
  const finanda = getFinandaService();

  // Admin can view any org's connections via query param
  const orgId = user.role === "ADMIN"
    ? new URL(req.url).searchParams.get("organizationId") ?? undefined
    : user.organizationId;

  const connections = orgId
    ? await prisma.finandaConnection.findMany({ where: { organizationId: orgId } })
    : [];

  return apiResponse({
    isConfigured: finanda.isConfigured,
    supportedBanks: finanda.getSupportedBanks(),
    connections,
  });
});

export const POST = withErrorHandler(async (req: Request) => {
  const user = await requireAuth();
  if (!user.organizationId) return apiError("לא שויך לארגון", 400);
  const orgId = user.organizationId;
  const body = await req.json();
  const { bankCode, bankName } = body;
  const finanda = getFinandaService();

  if (!finanda.isConfigured) {
    return apiResponse({
      success: false,
      message: "Finanda לא מוגדר. יש להגדיר FINANDA_API_KEY, FINANDA_CUSTOMER_ID ו-FINANDA_SECRET_KEY.",
    });
  }

  const connection = await prisma.finandaConnection.upsert({
    where: { organizationId_bankCode: { organizationId: orgId, bankCode } },
    update: { status: "PENDING_CONSENT", lastError: null },
    create: {
      organizationId: orgId,
      bankCode,
      bankName,
      status: "PENDING_CONSENT",
    },
  });

  return apiResponse(connection, 201);
});
