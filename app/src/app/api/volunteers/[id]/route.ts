import { prisma } from "@/lib/prisma";
import { requireManager, apiResponse, apiError, withErrorHandler } from "@/lib/api-helpers";
import { updateVolunteerSchema } from "@/lib/validators";

export const GET = withErrorHandler(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const user = await requireManager();
  const { id } = await params;

  const volunteer = await prisma.volunteer.findFirst({
    where: { id, organizationId: user.organizationId! },
    include: { hours: { orderBy: { date: "desc" } } },
  });

  if (!volunteer) return apiError("מתנדב לא נמצא", 404);
  return apiResponse(volunteer);
});

export const PUT = withErrorHandler(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const user = await requireManager();
  const { id } = await params;
  const body = await req.json();
  const data = updateVolunteerSchema.parse(body);

  const result = await prisma.volunteer.updateMany({
    where: { id, organizationId: user.organizationId! },
    data: {
      ...data,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
    },
  });

  if (result.count === 0) return apiError("מתנדב לא נמצא", 404);
  return apiResponse({ updated: true });
});
