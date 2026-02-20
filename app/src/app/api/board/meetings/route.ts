import { prisma } from "@/lib/prisma";
import { requireManager, getAuthSession, apiResponse, apiError, withErrorHandler } from "@/lib/api-helpers";
import { createBoardMeetingSchema } from "@/lib/validators";
import { publishEvent, logAudit } from "@/lib/events";

export const GET = withErrorHandler(async (req: Request) => {
  const user = await getAuthSession();
  if (!user) return apiError("לא מחובר", 401);

  const orgId = user.role === "ADMIN"
    ? new URL(req.url).searchParams.get("organizationId") ?? undefined
    : user.organizationId;

  if (!orgId) return apiError("לא שויך לארגון", 400);

  const meetings = await prisma.boardMeeting.findMany({
    where: { organizationId: orgId },
    include: { protocol: true, resolutions: true },
    orderBy: { date: "desc" },
  });

  return apiResponse(meetings);
});

export const POST = withErrorHandler(async (req: Request) => {
  const user = await requireManager();
  const body = await req.json();
  const data = createBoardMeetingSchema.parse(body);

  const meeting = await prisma.boardMeeting.create({
    data: {
      organizationId: user.organizationId!,
      title: data.title,
      date: new Date(data.date),
      location: data.location,
      summary: data.summary,
    },
  });

  await publishEvent({
    type: "meeting.created",
    organizationId: user.organizationId!,
    entityId: meeting.id,
    userId: user.id,
    data: { meetingTitle: meeting.title },
  });

  await logAudit({
    organizationId: user.organizationId,
    userId: user.id,
    action: "create",
    entity: "boardMeeting",
    entityId: meeting.id,
  });

  return apiResponse(meeting, 201);
});
