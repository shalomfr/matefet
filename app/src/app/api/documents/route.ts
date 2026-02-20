import { prisma } from "@/lib/prisma";
import { requireManager, getAuthSession, apiResponse, apiError, withErrorHandler } from "@/lib/api-helpers";
import { createDocumentSchema } from "@/lib/validators";
import { publishEvent, logAudit } from "@/lib/events";

export const GET = withErrorHandler(async (req: Request) => {
  const user = await getAuthSession();
  if (!user) return apiError("לא מחובר", 401);

  const orgId = user.role === "ADMIN"
    ? new URL(req.url).searchParams.get("organizationId") ?? undefined
    : user.organizationId;

  if (!orgId) return apiError("לא שויך לארגון", 400);

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") ?? undefined;

  const documents = await prisma.organizationDocument.findMany({
    where: {
      organizationId: orgId,
      ...(category ? { category: category as "FOUNDING" | "FINANCIAL" | "COMPLIANCE" | "BOARD" | "GENERAL" } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return apiResponse(documents);
});

export const POST = withErrorHandler(async (req: Request) => {
  const user = await requireManager();
  const body = await req.json();
  const data = createDocumentSchema.parse(body);

  const doc = await prisma.organizationDocument.create({
    data: {
      organizationId: user.organizationId!,
      name: data.name,
      category: data.category,
      description: data.description,
      fileUrl: data.fileUrl,
    },
  });

  await publishEvent({
    type: "document.uploaded",
    organizationId: user.organizationId!,
    entityId: doc.id,
    userId: user.id,
    data: { documentName: doc.name },
  });

  await logAudit({
    organizationId: user.organizationId,
    userId: user.id,
    action: "create",
    entity: "document",
    entityId: doc.id,
  });

  return apiResponse(doc, 201);
});
