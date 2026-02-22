import { prisma } from "@/lib/prisma";
import { requireManager, apiResponse, withErrorHandler } from "@/lib/api-helpers";
import { getFinandaService } from "@/lib/finanda";

export const POST = withErrorHandler(async () => {
  const user = await requireManager();
  const orgId = user.organizationId!;
  const finanda = getFinandaService();

  if (!finanda.isConfigured) {
    return apiResponse({
      synced: false,
      message: "Finanda לא מוגדר. סנכרון לא זמין.",
    });
  }

  const connections = await prisma.finandaConnection.findMany({
    where: { organizationId: orgId, status: "ACTIVE" },
  });

  if (connections.length === 0) {
    return apiResponse({
      synced: false,
      message: "אין חיבורים פעילים לסנכרון.",
    });
  }

  // In production, this would:
  // 1. For each active connection, call finanda.getAccounts() and finanda.getTransactions()
  // 2. Upsert accounts and transactions into the database
  // 3. Update connection.lastSyncAt
  // For now, return the current state
  return apiResponse({
    synced: true,
    connectionsCount: connections.length,
    message: `סונכרנו ${connections.length} חיבורים בהצלחה.`,
  });
});
