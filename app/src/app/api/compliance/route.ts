import { prisma } from "@/lib/prisma";
import { requireManager, getAuthSession, apiResponse, apiError, withErrorHandler } from "@/lib/api-helpers";
import { createComplianceItemSchema } from "@/lib/validators";
import { logAudit } from "@/lib/events";

export const GET = withErrorHandler(async (req: Request) => {
  const user = await getAuthSession();
  if (!user) return apiError("לא מחובר", 401);

  const url = new URL(req.url);
  const orgId = user.role === "ADMIN"
    ? url.searchParams.get("organizationId") ?? undefined
    : user.organizationId;

  if (!orgId) return apiError("לא שויך לארגון", 400);

  const categoryFilter = url.searchParams.get("category") ?? undefined;

  const [items, certificates] = await Promise.all([
    prisma.complianceItem.findMany({
      where: {
        organizationId: orgId,
        ...(categoryFilter ? { category: categoryFilter as never } : {}),
      },
      orderBy: { category: "asc" },
    }),
    prisma.complianceCertificate.findMany({
      where: { organizationId: orgId },
      orderBy: { expiresAt: "asc" },
    }),
  ]);

  return apiResponse({ items, certificates });
});

export const POST = withErrorHandler(async (req: Request) => {
  const user = await requireManager();
  const body = await req.json();
  const data = createComplianceItemSchema.parse(body);

  const item = await prisma.complianceItem.create({
    data: {
      organizationId: user.organizationId!,
      name: data.name,
      type: data.type,
      category: (data.category ?? "FOUNDING_DOCS") as never,
      description: data.description,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      status: data.status ?? "MISSING",
      isRequired: data.isRequired ?? true,
      frequency: data.frequency,
      legalBasis: data.legalBasis,
    },
  });

  await logAudit({
    organizationId: user.organizationId,
    userId: user.id,
    action: "create",
    entity: "complianceItem",
    entityId: item.id,
  });

  return apiResponse(item, 201);
});
