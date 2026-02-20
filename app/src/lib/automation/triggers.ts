export const TRIGGER_EVENTS = {
  "donation.created": { label: "תרומה חדשה התקבלה", entity: "donation" },
  "donation.updated": { label: "תרומה עודכנה", entity: "donation" },
  "donation.cancelled": { label: "תרומה בוטלה", entity: "donation" },
  "compliance.expiring": { label: "אישור עומד לפוג", entity: "compliance" },
  "compliance.expired": { label: "אישור פג תוקף", entity: "compliance" },
  "compliance.updated": { label: "סטטוס ניהול תקין עודכן", entity: "compliance" },
  "meeting.created": { label: "ישיבה חדשה נקבעה", entity: "meeting" },
  "meeting.completed": { label: "ישיבה הסתיימה", entity: "meeting" },
  "resolution.created": { label: "החלטה חדשה", entity: "resolution" },
  "volunteer.hours.submitted": { label: "שעות מתנדב הוגשו", entity: "volunteer" },
  "volunteer.hours.approved": { label: "שעות מתנדב אושרו", entity: "volunteer" },
  "budget.threshold": { label: "חריגה מתקציב", entity: "budget" },
  "document.uploaded": { label: "מסמך הועלה", entity: "document" },
  "user.registered": { label: "משתמש חדש נרשם", entity: "user" },
  "user.approved": { label: "משתמש אושר", entity: "user" },
} as const;

export type TriggerEventType = keyof typeof TRIGGER_EVENTS;

export const SCHEDULE_PRESETS = [
  { cron: "0 9 * * 0", label: "כל יום ראשון ב-09:00" },
  { cron: "0 9 1 * *", label: "ראשון לחודש ב-09:00" },
  { cron: "0 9 1 1 *", label: "1 בינואר (שנתי)" },
  { cron: "0 8 * * 0-4", label: "כל יום עבודה ב-08:00" },
] as const;
