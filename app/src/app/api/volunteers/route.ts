import { prisma } from "@/lib/prisma";
import { requireManager, getAuthSession, apiResponse, apiError, withErrorHandler } from "@/lib/api-helpers";
import { createVolunteerSchema } from "@/lib/validators";

export const GET = withErrorHandler(async (req: Request) => {
  const user = await getAuthSession();
  if (!user) return apiError("לא מחובר", 401);

  const orgId = user.role === "ADMIN"
    ? new URL(req.url).searchParams.get("organizationId") ?? undefined
    : user.organizationId;

  if (!orgId) return apiError("לא שויך לארגון", 400);

  const volunteers = await prisma.volunteer.findMany({
    where: { organizationId: orgId },
    include: { hours: { orderBy: { date: "desc" }, take: 5 } },
    orderBy: { createdAt: "desc" },
  });

  return apiResponse(volunteers);
});

export const POST = withErrorHandler(async (req: Request) => {
  const user = await requireManager();
  const body = await req.json();
  const data = createVolunteerSchema.parse(body);

  const volunteer = await prisma.volunteer.create({
    data: {
      organizationId: user.organizationId!,
      name: data.name,
      email: data.email || null,
      phone: data.phone,
      idNumber: data.idNumber,
      role: data.role,
      startDate: data.startDate ? new Date(data.startDate) : null,
    },
  });

  return apiResponse(volunteer, 201);
});
