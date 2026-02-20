import type { WorkflowTriggerType, ActionType } from "@prisma/client";

export type WorkflowTemplate = {
  id: string;
  name: string;
  description: string;
  triggerType: WorkflowTriggerType;
  triggerConfig: Record<string, unknown>;
  steps: Array<{
    order: number;
    actionType: ActionType;
    actionConfig: Record<string, unknown>;
  }>;
};

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: "donation-receipt",
    name: "קבלה אוטומטית לתרומה",
    description: "שליחת קבלה אוטומטית כשמתקבלת תרומה חדשה",
    triggerType: "EVENT",
    triggerConfig: { eventType: "donation.created" },
    steps: [
      {
        order: 1,
        actionType: "SEND_EMAIL",
        actionConfig: {
          to: "{{donorEmail}}",
          subject: "קבלה על תרומתך - תודה רבה!",
          html: "<div dir='rtl'><h2>תודה על תרומתך!</h2><p>סכום: ₪{{amount}}</p></div>",
        },
      },
      {
        order: 2,
        actionType: "SEND_NOTIFICATION",
        actionConfig: {
          type: "SUCCESS",
          title: "תרומה חדשה התקבלה",
          message: "תרומה בסך ₪{{amount}} מאת {{donorName}}",
        },
      },
    ],
  },
  {
    id: "compliance-reminder-30",
    name: "תזכורת ניהול תקין (30 יום)",
    description: "שליחת תזכורת 30 יום לפני תום תוקף אישור",
    triggerType: "SCHEDULE",
    triggerConfig: { cron: "0 9 * * 0" },
    steps: [
      {
        order: 1,
        actionType: "SEND_NOTIFICATION",
        actionConfig: {
          type: "WARNING",
          title: "תזכורת ניהול תקין",
          message: "{{itemName}} יפוג בעוד {{daysLeft}} ימים",
        },
      },
      {
        order: 2,
        actionType: "SEND_EMAIL",
        actionConfig: {
          to: "{{managerEmail}}",
          subject: "תזכורת: {{itemName}} עומד לפוג",
          html: "<div dir='rtl'><p>{{itemName}} יפוג בתאריך {{dueDate}}</p></div>",
        },
      },
    ],
  },
  {
    id: "meeting-summary",
    name: "סיכום ישיבת ועד",
    description: "שליחת סיכום אוטומטי בסיום ישיבת ועד",
    triggerType: "EVENT",
    triggerConfig: { eventType: "meeting.completed" },
    steps: [
      {
        order: 1,
        actionType: "SEND_EMAIL",
        actionConfig: {
          to: "{{attendeesEmails}}",
          subject: "סיכום ישיבת ועד: {{meetingTitle}}",
          html: "<div dir='rtl'><h2>{{meetingTitle}}</h2><p>{{summary}}</p></div>",
        },
      },
      {
        order: 2,
        actionType: "CREATE_DOCUMENT",
        actionConfig: {
          name: "פרוטוקול ישיבה - {{meetingTitle}}",
          category: "BOARD",
          description: "{{summary}}",
        },
      },
    ],
  },
  {
    id: "monthly-report",
    name: "דוח חודשי אוטומטי",
    description: "יצירת דוח חודשי אוטומטי בתחילת כל חודש",
    triggerType: "SCHEDULE",
    triggerConfig: { cron: "0 9 1 * *" },
    steps: [
      {
        order: 1,
        actionType: "CREATE_DOCUMENT",
        actionConfig: {
          name: "דוח חודשי - {{month}}/{{year}}",
          category: "FINANCIAL",
          description: "דוח חודשי אוטומטי",
        },
      },
      {
        order: 2,
        actionType: "SEND_NOTIFICATION",
        actionConfig: {
          type: "INFO",
          title: "דוח חודשי מוכן",
          message: "הדוח החודשי מוכן לצפייה",
        },
      },
    ],
  },
  {
    id: "annual-report-reminder",
    name: "תזכורת דוח שנתי",
    description: "תזכורת להגשת דוח שנתי לרשם העמותות",
    triggerType: "SCHEDULE",
    triggerConfig: { cron: "0 9 1 1 *" },
    steps: [
      {
        order: 1,
        actionType: "SEND_NOTIFICATION",
        actionConfig: {
          type: "WARNING",
          title: "תזכורת דוח שנתי",
          message: "יש להגיש דוח שנתי לרשם העמותות עד סוף מרץ",
        },
      },
      {
        order: 2,
        actionType: "SEND_EMAIL",
        actionConfig: {
          to: "{{managerEmail}}",
          subject: "תזכורת: הגשת דוח שנתי",
          html: "<div dir='rtl'><p>נא להגיש דוח שנתי לרשם העמותות.</p></div>",
        },
      },
    ],
  },
  {
    id: "holiday-greetings",
    name: "ברכות חג לתורמים",
    description: "שליחת ברכות חג אוטומטית לכל התורמים",
    triggerType: "MANUAL",
    triggerConfig: {},
    steps: [
      {
        order: 1,
        actionType: "SEND_EMAIL",
        actionConfig: {
          to: "{{allDonorEmails}}",
          subject: "ברכות חג שמח!",
          html: "<div dir='rtl'><h2>חג שמח!</h2><p>תודה על תמיכתכם הנדיבה.</p></div>",
        },
      },
    ],
  },
  {
    id: "volunteer-hours-approval",
    name: "אישור שעות מתנדבים",
    description: "שליחת אישור אוטומטי כשמתנדב מגיש שעות",
    triggerType: "EVENT",
    triggerConfig: { eventType: "volunteer.hours.submitted" },
    steps: [
      {
        order: 1,
        actionType: "SEND_NOTIFICATION",
        actionConfig: {
          type: "INFO",
          title: "שעות מתנדב הוגשו",
          message: "{{volunteerName}} הגיש {{hours}} שעות לאישור",
        },
      },
    ],
  },
  {
    id: "budget-threshold",
    name: "התראת חריגה מתקציב",
    description: "התראה כאשר ההוצאות עוברות 80% מהתקציב",
    triggerType: "EVENT",
    triggerConfig: {
      eventType: "budget.threshold",
      conditions: { operator: "AND", rules: [{ field: "percentage", op: "gte", value: 80 }] },
    },
    steps: [
      {
        order: 1,
        actionType: "SEND_NOTIFICATION",
        actionConfig: {
          type: "WARNING",
          title: "חריגה מתקציב",
          message: "ההוצאות הגיעו ל-{{percentage}}% מהתקציב",
        },
      },
      {
        order: 2,
        actionType: "SEND_EMAIL",
        actionConfig: {
          to: "{{managerEmail}}",
          subject: "התראת חריגה מתקציב",
          html: "<div dir='rtl'><p>ההוצאות הגיעו ל-{{percentage}}% מהתקציב בקטגוריה {{category}}</p></div>",
        },
      },
    ],
  },
  {
    id: "document-backup",
    name: "גיבוי מסמכים",
    description: "התראה בהעלאת מסמך חדש",
    triggerType: "EVENT",
    triggerConfig: { eventType: "document.uploaded" },
    steps: [
      {
        order: 1,
        actionType: "SEND_NOTIFICATION",
        actionConfig: {
          type: "SUCCESS",
          title: "מסמך חדש הועלה",
          message: "המסמך '{{documentName}}' הועלה בהצלחה",
        },
      },
    ],
  },
  {
    id: "compliance-status-check",
    name: "בדיקת סטטוס ניהול תקין",
    description: "בדיקה שבועית של סטטוס ניהול תקין",
    triggerType: "SCHEDULE",
    triggerConfig: { cron: "0 9 * * 0" },
    steps: [
      {
        order: 1,
        actionType: "SEND_NOTIFICATION",
        actionConfig: {
          type: "INFO",
          title: "בדיקת ניהול תקין",
          message: "בדיקת סטטוס ניהול תקין הושלמה",
        },
      },
    ],
  },
];
