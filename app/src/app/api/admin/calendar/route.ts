import { prisma } from "@/lib/prisma";
import { requireAdmin, apiResponse, withErrorHandler } from "@/lib/api-helpers";

export const GET = withErrorHandler(async (req: Request) => {
  await requireAdmin();
  const url = new URL(req.url);
  const month = parseInt(url.searchParams.get("month") ?? String(new Date().getMonth()));
  const year = parseInt(url.searchParams.get("year") ?? String(new Date().getFullYear()));
  const orgFilter = url.searchParams.get("organizationId") ?? undefined;

  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0, 23, 59, 59);

  const whereOrg = orgFilter ? { organizationId: orgFilter } : {};

  const [adminEvents, boardMeetings, complianceItems] = await Promise.all([
    prisma.adminEvent.findMany({
      where: { ...whereOrg, date: { gte: startDate, lte: endDate } },
      include: { organization: { select: { id: true, name: true } } },
      orderBy: { date: "asc" },
    }),
    prisma.boardMeeting.findMany({
      where: { ...whereOrg, date: { gte: startDate, lte: endDate } },
      include: { organization: { select: { id: true, name: true } } },
      orderBy: { date: "asc" },
    }),
    prisma.complianceItem.findMany({
      where: { ...whereOrg, dueDate: { gte: startDate, lte: endDate }, status: { not: "OK" } },
      include: { organization: { select: { id: true, name: true } } },
      orderBy: { dueDate: "asc" },
    }),
  ]);

  return apiResponse({ adminEvents, boardMeetings, complianceItems });
});
