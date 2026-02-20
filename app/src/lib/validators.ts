import { z } from "zod";

// ==================== DONORS ====================
export const createDonorSchema = z.object({
  firstName: z.string().min(1, "שם פרטי נדרש"),
  lastName: z.string().min(1, "שם משפחה נדרש"),
  email: z.string().email("אימייל לא תקין").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  idNumber: z.string().optional(),
  notes: z.string().optional(),
});

export const updateDonorSchema = createDonorSchema.partial();

// ==================== DONATIONS ====================
export const createDonationSchema = z.object({
  donorId: z.string().optional(),
  amount: z.number().positive("סכום חייב להיות חיובי"),
  currency: z.string().default("ILS"),
  method: z.string().optional(),
  reference: z.string().optional(),
  campaignId: z.string().optional(),
  notes: z.string().optional(),
  donatedAt: z.string().datetime().optional(),
});

export const updateDonationSchema = z.object({
  status: z.enum(["PENDING", "COMPLETED", "CANCELLED", "REFUNDED"]).optional(),
  notes: z.string().optional(),
});

// ==================== COMPLIANCE ====================
export const createComplianceItemSchema = z.object({
  name: z.string().min(1, "שם נדרש"),
  type: z.enum(["CERTIFICATE", "REPORT", "DOCUMENT", "APPROVAL", "REGISTRATION"]),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  status: z.enum(["OK", "WARNING", "EXPIRED", "MISSING"]).optional(),
});

export const updateComplianceItemSchema = z.object({
  name: z.string().optional(),
  status: z.enum(["OK", "WARNING", "EXPIRED", "MISSING"]).optional(),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional().nullable(),
  completedAt: z.string().datetime().optional().nullable(),
  documentUrl: z.string().optional().nullable(),
});

// ==================== DOCUMENTS ====================
export const createDocumentSchema = z.object({
  name: z.string().min(1, "שם נדרש"),
  category: z.enum(["FOUNDING", "FINANCIAL", "COMPLIANCE", "BOARD", "GENERAL"]).default("GENERAL"),
  description: z.string().optional(),
  fileUrl: z.string().optional(),
});

// ==================== BOARD ====================
export const createBoardMeetingSchema = z.object({
  title: z.string().min(1, "כותרת נדרשת"),
  date: z.string().datetime(),
  location: z.string().optional(),
  summary: z.string().optional(),
});

export const updateBoardMeetingSchema = z.object({
  title: z.string().optional(),
  date: z.string().datetime().optional(),
  location: z.string().optional(),
  status: z.enum(["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
  summary: z.string().optional(),
  attendeesCount: z.number().optional(),
});

export const createBoardMemberSchema = z.object({
  name: z.string().min(1, "שם נדרש"),
  role: z.string().min(1, "תפקיד נדרש"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  idNumber: z.string().optional(),
  startDate: z.string().datetime().optional(),
});

export const createBoardResolutionSchema = z.object({
  meetingId: z.string().optional(),
  title: z.string().min(1, "כותרת נדרשת"),
  description: z.string().optional(),
  votesFor: z.number().default(0),
  votesAgainst: z.number().default(0),
  votesAbstain: z.number().default(0),
});

// ==================== VOLUNTEERS ====================
export const createVolunteerSchema = z.object({
  name: z.string().min(1, "שם נדרש"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  idNumber: z.string().optional(),
  role: z.string().optional(),
  startDate: z.string().datetime().optional(),
});

export const updateVolunteerSchema = createVolunteerSchema.partial().extend({
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

// ==================== BUDGET ====================
export const createBudgetSchema = z.object({
  year: z.number().int(),
  name: z.string().min(1, "שם נדרש"),
  totalBudget: z.number().positive("תקציב חייב להיות חיובי"),
});

export const createBudgetLineSchema = z.object({
  budgetId: z.string(),
  category: z.string().min(1, "קטגוריה נדרשת"),
  planned: z.number(),
  notes: z.string().optional(),
});

// ==================== WORKFLOWS ====================
export const createWorkflowSchema = z.object({
  name: z.string().min(1, "שם נדרש"),
  description: z.string().optional(),
  triggerType: z.enum(["EVENT", "SCHEDULE", "MANUAL"]),
  triggerConfig: z.record(z.string(), z.unknown()).optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "DRAFT"]).default("DRAFT"),
  steps: z.array(z.object({
    order: z.number(),
    actionType: z.enum(["SEND_EMAIL", "CREATE_DOCUMENT", "UPDATE_RECORD", "SEND_NOTIFICATION", "WEBHOOK"]),
    actionConfig: z.record(z.string(), z.unknown()).optional(),
    conditionConfig: z.record(z.string(), z.unknown()).optional(),
  })).optional(),
});

export const updateWorkflowSchema = createWorkflowSchema.partial();

// ==================== NOTIFICATIONS ====================
export const markNotificationReadSchema = z.object({
  ids: z.array(z.string()).optional(),
  all: z.boolean().optional(),
});
