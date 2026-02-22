import { prisma } from "@/lib/prisma";
import { requireManager, apiResponse, withErrorHandler } from "@/lib/api-helpers";

export const GET = withErrorHandler(async () => {
  const user = await requireManager();
  const orgId = user.organizationId!;

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const yearStart = new Date(now.getFullYear(), 0, 1);

  const [
    complianceItems,
    donationsThisYear,
    totalDonors,
    upcomingMeetings,
    activeVolunteers,
    recentNotifications,
    budgets,
    documents,
    boardMembers,
    bankAccounts,
    expensesTotal,
    finandaConnections,
  ] = await Promise.all([
    prisma.complianceItem.findMany({ where: { organizationId: orgId } }),
    prisma.donation.aggregate({
      where: { organizationId: orgId, donatedAt: { gte: yearStart }, status: "COMPLETED" },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.donor.count({ where: { organizationId: orgId } }),
    prisma.boardMeeting.findMany({
      where: { organizationId: orgId, date: { gte: now }, status: "SCHEDULED" },
      orderBy: { date: "asc" },
      take: 3,
    }),
    prisma.volunteer.count({ where: { organizationId: orgId, status: "ACTIVE" } }),
    prisma.notification.findMany({
      where: { organizationId: orgId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.budget.findMany({
      where: { organizationId: orgId, isActive: true },
      include: { lines: true },
    }),
    prisma.organizationDocument.count({ where: { organizationId: orgId } }),
    prisma.boardMember.findMany({
      where: { organizationId: orgId, isActive: true },
    }),
    prisma.bankAccount.findMany({
      where: { organizationId: orgId, isActive: true },
    }),
    prisma.expense.aggregate({
      where: { organizationId: orgId, status: "PAID" },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.finandaConnection.findMany({
      where: { organizationId: orgId },
    }),
  ]);

  const okCount = complianceItems.filter((i) => i.status === "OK").length;
  const complianceScore = complianceItems.length > 0
    ? Math.round((okCount / complianceItems.length) * 100)
    : 0;

  const expiringItems = complianceItems.filter((i) => {
    if (!i.dueDate) return false;
    const daysUntil = Math.ceil((i.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil > 0 && daysUntil <= 30;
  });

  const categoryLabels: Record<string, string> = {
    FOUNDING_DOCS: "מסמכי יסוד",
    ANNUAL_OBLIGATIONS: "חובות שנתיות לרשם",
    TAX_APPROVALS: "אישורים מרשות המסים",
    FINANCIAL_MGMT: "ניהול כספי שוטף",
    DISTRIBUTION_DOCS: "תיעוד חלוקת כספים",
    GOVERNANCE: "ממשל ופרוטוקולים",
    EMPLOYEES_VOLUNTEERS: "עובדים ומתנדבים",
    INSURANCE: "ביטוח",
    GEMACH: "גמ\"ח כספים",
  };

  const categoryMap: Record<string, { ok: number; total: number }> = {};
  for (const item of complianceItems) {
    const cat = (item as { category?: string }).category ?? "FOUNDING_DOCS";
    if (!categoryMap[cat]) categoryMap[cat] = { ok: 0, total: 0 };
    categoryMap[cat].total++;
    if (item.status === "OK") categoryMap[cat].ok++;
  }
  const categoryScores = Object.entries(categoryMap).map(([category, { ok, total }]) => ({
    category,
    label: categoryLabels[category] ?? category,
    ok,
    total,
    score: total > 0 ? Math.round((ok / total) * 100) : 0,
  })).sort((a, b) => a.score - b.score);

  return apiResponse({
    compliance: {
      score: complianceScore,
      total: complianceItems.length,
      ok: okCount,
      warning: complianceItems.filter((i) => i.status === "WARNING").length,
      expired: complianceItems.filter((i) => i.status === "EXPIRED").length,
      missing: complianceItems.filter((i) => i.status === "MISSING").length,
      expiringSoon: expiringItems.length,
      items: complianceItems,
      categoryScores,
    },
    financial: {
      totalDonationsThisYear: donationsThisYear._sum.amount ?? 0,
      donationCount: donationsThisYear._count,
      totalDonors,
      budgets: budgets.map((b) => ({
        id: b.id,
        year: b.year,
        name: b.name,
        totalBudget: b.totalBudget,
        totalSpent: b.totalSpent,
        percentage: b.totalBudget > 0 ? Math.round((b.totalSpent / b.totalBudget) * 100) : 0,
        lines: b.lines,
      })),
    },
    board: {
      members: boardMembers,
      upcomingMeetings,
    },
    volunteers: { activeCount: activeVolunteers },
    documents: { count: documents },
    notifications: recentNotifications,
    banking: {
      totalBalance: bankAccounts.reduce((sum, a) => sum + a.balance, 0),
      accounts: bankAccounts.length,
      totalExpenses: expensesTotal._sum.amount ?? 0,
      expenseCount: expensesTotal._count,
      connections: finandaConnections.length,
      isConnected: finandaConnections.some((c) => c.status === "ACTIVE"),
    },
  });
});
