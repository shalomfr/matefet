import { prisma } from "@/lib/prisma";
import { requireManager, getAuthSession, apiResponse, apiError, withErrorHandler } from "@/lib/api-helpers";
import { createBoardResolutionSchema } from "@/lib/validators";
import { publishEvent } from "@/lib/events";

export const GET = withErrorHandler(async (req: Request) => {
  const user = await getAuthSession();
  if (!user) return apiError("לא מחובר", 401);

  const orgId = user.role === "ADMIN"
    ? new URL(req.url).searchParams.get("organizationId") ?? undefined
    : user.organizationId;

  if (!orgId) return apiError("לא שויך לארגון", 400);

  const resolutions = await prisma.boardResolution.findMany({
    where: { organizationId: orgId },
    include: { meeting: true },
    orderBy: { createdAt: "desc" },
  });

  return apiResponse(resolutions);
});

export const POST = withErrorHandler(async (req: Request) => {
  const user = await requireManager();
  const body = await req.json();
  const data = createBoardResolutionSchema.parse(body);

  const resolution = await prisma.boardResolution.create({
    data: {
      organizationId: user.organizationId!,
      meetingId: data.meetingId,
      title: data.title,
      description: data.description,
      votesFor: data.votesFor,
      votesAgainst: data.votesAgainst,
      votesAbstain: data.votesAbstain,
    },
  });

  await publishEvent({
    type: "resolution.created",
    organizationId: user.organizationId!,
    entityId: resolution.id,
    userId: user.id,
    data: { title: resolution.title },
  });

  return apiResponse(resolution, 201);
});
