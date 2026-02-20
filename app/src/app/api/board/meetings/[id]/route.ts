import { prisma } from "@/lib/prisma";
import { requireManager, apiResponse, apiError, withErrorHandler } from "@/lib/api-helpers";
import { updateBoardMeetingSchema } from "@/lib/validators";
import { publishEvent } from "@/lib/events";

export const GET = withErrorHandler(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const user = await requireManager();
  const { id } = await params;

  const meeting = await prisma.boardMeeting.findFirst({
    where: { id, organizationId: user.organizationId! },
    include: { protocol: true, resolutions: true },
  });

  if (!meeting) return apiError("ישיבה לא נמצאה", 404);
  return apiResponse(meeting);
});

export const PUT = withErrorHandler(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const user = await requireManager();
  const { id } = await params;
  const body = await req.json();
  const data = updateBoardMeetingSchema.parse(body);

  const existing = await prisma.boardMeeting.findFirst({
    where: { id, organizationId: user.organizationId! },
  });
  if (!existing) return apiError("ישיבה לא נמצאה", 404);

  const meeting = await prisma.boardMeeting.update({
    where: { id },
    data: {
      ...data,
      date: data.date ? new Date(data.date) : undefined,
    },
  });

  if (data.status === "COMPLETED" && existing.status !== "COMPLETED") {
    await publishEvent({
      type: "meeting.completed",
      organizationId: user.organizationId!,
      entityId: id,
      userId: user.id,
      data: { meetingTitle: meeting.title, summary: meeting.summary },
    });
  }

  return apiResponse(meeting);
});
