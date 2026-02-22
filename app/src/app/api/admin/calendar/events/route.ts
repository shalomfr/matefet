import { prisma } from "@/lib/prisma";
import { requireAdmin, apiResponse, withErrorHandler } from "@/lib/api-helpers";
import { createAdminEventSchema } from "@/lib/validators";
import { logAudit } from "@/lib/events";

export const GET = withErrorHandler(async (req: Request) => {
  await requireAdmin();
  const url = new URL(req.url);
  const orgFilter = url.searchParams.get("organizationId") ?? undefined;
  const typeFilter = url.searchParams.get("type") ?? undefined;

  const events = await prisma.adminEvent.findMany({
    where: {
      ...(orgFilter ? { organizationId: orgFilter } : {}),
      ...(typeFilter ? { type: typeFilter as never } : {}),
    },
    include: { organization: { select: { id: true, name: true } } },
    orderBy: { date: "asc" },
  });

  return apiResponse(events);
});

export const POST = withErrorHandler(async (req: Request) => {
  const user = await requireAdmin();
  const body = await req.json();
  const data = createAdminEventSchema.parse(body);

  const event = await prisma.adminEvent.create({
    data: {
      organizationId: data.organizationId,
      title: data.title,
      description: data.description,
      type: data.type,
      date: new Date(data.date),
      endDate: data.endDate ? new Date(data.endDate) : null,
      time: data.time,
      endTime: data.endTime,
      location: data.location,
      notes: data.notes,
      createdBy: user.id,
    },
    include: { organization: { select: { id: true, name: true } } },
  });

  await logAudit({
    organizationId: data.organizationId,
    userId: user.id,
    action: "create",
    entity: "adminEvent",
    entityId: event.id,
  });

  return apiResponse(event, 201);
});
