import { prisma } from "@/lib/prisma";
import { requireManager, getAuthSession, apiResponse, apiError, withErrorHandler } from "@/lib/api-helpers";
import { createBoardMemberSchema } from "@/lib/validators";

export const GET = withErrorHandler(async (req: Request) => {
  const user = await getAuthSession();
  if (!user) return apiError("לא מחובר", 401);

  const orgId = user.role === "ADMIN"
    ? new URL(req.url).searchParams.get("organizationId") ?? undefined
    : user.organizationId;

  if (!orgId) return apiError("לא שויך לארגון", 400);

  const members = await prisma.boardMember.findMany({
    where: { organizationId: orgId },
    orderBy: { createdAt: "desc" },
  });

  return apiResponse(members);
});

export const POST = withErrorHandler(async (req: Request) => {
  const user = await requireManager();
  const body = await req.json();
  const data = createBoardMemberSchema.parse(body);

  const member = await prisma.boardMember.create({
    data: {
      organizationId: user.organizationId!,
      name: data.name,
      role: data.role,
      email: data.email || null,
      phone: data.phone,
      idNumber: data.idNumber,
      startDate: data.startDate ? new Date(data.startDate) : null,
    },
  });

  return apiResponse(member, 201);
});
