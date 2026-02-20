import { prisma } from "@/lib/prisma";
import { requireAdmin, apiResponse, withErrorHandler } from "@/lib/api-helpers";

export const GET = withErrorHandler(async () => {
  await requireAdmin();

  const [
    orgCount,
    userCount,
    pendingUsers,
    activeWorkflows,
    totalExecutions,
    recentExecutions,
    totalDonations,
    organizations,
  ] = await Promise.all([
    prisma.organization.count(),
    prisma.user.count(),
    prisma.user.count({ where: { role: "MANAGER", status: "PENDING" } }),
    prisma.workflow.count({ where: { status: "ACTIVE" } }),
    prisma.workflowExecution.count(),
    prisma.workflowExecution.findMany({
      orderBy: { startedAt: "desc" },
      take: 10,
      include: {
        workflow: { select: { name: true } },
        organization: { select: { name: true } },
      },
    }),
    prisma.donation.aggregate({ _sum: { amount: true }, _count: true }),
    prisma.organization.findMany({
      include: {
        _count: { select: { users: true, workflows: true, donations: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return apiResponse({
    overview: {
      organizations: orgCount,
      users: userCount,
      pendingApprovals: pendingUsers,
      activeWorkflows,
      totalExecutions,
      totalDonations: totalDonations._sum.amount ?? 0,
      donationCount: totalDonations._count,
    },
    recentExecutions,
    organizations: organizations.map((org) => ({
      id: org.id,
      name: org.name,
      number: org.number,
      users: org._count.users,
      workflows: org._count.workflows,
      donations: org._count.donations,
      createdAt: org.createdAt,
    })),
  });
});
