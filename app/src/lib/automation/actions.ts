import type { WorkflowStep } from "@prisma/client";
import { prisma } from "../prisma";
import { sendEmail } from "../email";

type ActionContext = {
  organizationId: string;
  triggerData?: Record<string, unknown>;
};

export async function executeAction(
  step: WorkflowStep,
  context: ActionContext
): Promise<Record<string, unknown>> {
  const config = (step.actionConfig ?? {}) as Record<string, unknown>;

  switch (step.actionType) {
    case "SEND_EMAIL":
      return executeSendEmail(config, context);
    case "CREATE_DOCUMENT":
      return executeCreateDocument(config, context);
    case "UPDATE_RECORD":
      return executeUpdateRecord(config, context);
    case "SEND_NOTIFICATION":
      return executeSendNotification(config, context);
    case "WEBHOOK":
      return executeWebhook(config, context);
    default:
      throw new Error(`Unknown action type: ${step.actionType}`);
  }
}

async function executeSendEmail(
  config: Record<string, unknown>,
  context: ActionContext
): Promise<Record<string, unknown>> {
  const to = resolveTemplate(String(config.to ?? ""), context.triggerData ?? {});
  const subject = resolveTemplate(String(config.subject ?? ""), context.triggerData ?? {});
  const html = resolveTemplate(String(config.html ?? config.body ?? ""), context.triggerData ?? {});

  const result = await sendEmail({ to, subject, html });
  return { messageId: result?.messageId, to, subject };
}

async function executeCreateDocument(
  config: Record<string, unknown>,
  context: ActionContext
): Promise<Record<string, unknown>> {
  const doc = await prisma.organizationDocument.create({
    data: {
      organizationId: context.organizationId,
      name: resolveTemplate(String(config.name ?? "מסמך אוטומטי"), context.triggerData ?? {}),
      category: (config.category as "FOUNDING" | "FINANCIAL" | "COMPLIANCE" | "BOARD" | "GENERAL") ?? "GENERAL",
      description: resolveTemplate(String(config.description ?? ""), context.triggerData ?? {}),
    },
  });
  return { documentId: doc.id, name: doc.name };
}

async function executeUpdateRecord(
  config: Record<string, unknown>,
  context: ActionContext
): Promise<Record<string, unknown>> {
  const model = String(config.model ?? "");
  const id = resolveTemplate(String(config.id ?? ""), context.triggerData ?? {});
  const data = (config.data as Record<string, unknown>) ?? {};

  type PrismaModel = { update: (args: { where: { id: string }; data: Record<string, unknown> }) => Promise<unknown> };

  const modelMap: Record<string, PrismaModel> = {
    complianceItem: prisma.complianceItem as unknown as PrismaModel,
    donation: prisma.donation as unknown as PrismaModel,
    boardMeeting: prisma.boardMeeting as unknown as PrismaModel,
  };

  const prismaModel = modelMap[model];
  if (!prismaModel) throw new Error(`Model ${model} not supported for update`);

  await prismaModel.update({ where: { id }, data });
  return { model, id, updated: true };
}

async function executeSendNotification(
  config: Record<string, unknown>,
  context: ActionContext
): Promise<Record<string, unknown>> {
  const notification = await prisma.notification.create({
    data: {
      organizationId: context.organizationId,
      userId: context.triggerData?.userId as string | undefined,
      type: (config.type as "INFO" | "WARNING" | "ERROR" | "SUCCESS") ?? "INFO",
      title: resolveTemplate(String(config.title ?? "התראה"), context.triggerData ?? {}),
      message: resolveTemplate(String(config.message ?? ""), context.triggerData ?? {}),
      link: config.link as string | undefined,
    },
  });
  return { notificationId: notification.id };
}

async function executeWebhook(
  config: Record<string, unknown>,
  context: ActionContext
): Promise<Record<string, unknown>> {
  const url = String(config.url ?? "");
  if (!url) throw new Error("Webhook URL is required");

  const response = await fetch(url, {
    method: String(config.method ?? "POST"),
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...context.triggerData, organizationId: context.organizationId }),
  });

  return { status: response.status, ok: response.ok };
}

function resolveTemplate(template: string, data: Record<string, unknown>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => String(data[key] ?? ""));
}
