export type TourStepType = "welcome" | "highlight" | "completion";
export type TourPosition = "bottom" | "top" | "left" | "right" | "bottom-left" | "bottom-right" | "top-left" | "top-right";

export interface TourStep {
  id: string;
  type: TourStepType;
  target?: string; // data-tour attribute value
  title: string;
  description: string;
  position?: TourPosition;
  mobileSkip?: boolean;
}

export const portalTourSteps: TourStep[] = [
  {
    id: "welcome",
    type: "welcome",
    title: "ברוכים הבאים למעטפת! 🎉",
    description: "המערכת שתעזור לכם לנהל את העמותה בצורה תקינה ומסודרת. בואו נסתכל על הכלים העיקריים.",
  },
  {
    id: "portal-sidebar",
    type: "highlight",
    target: "portal-sidebar",
    title: "תפריט הניווט",
    description: "מכאן תוכלו לנווט בין כל חלקי המערכת — מצב ניהול תקין, מסמכים, ועד, דוחות ועוד.",
    position: "left",
    mobileSkip: true,
  },
  {
    id: "portal-stats",
    type: "highlight",
    target: "portal-stats",
    title: "מספרים מרכזיים",
    description: "כאן תמצאו את הציון הכללי, משימות פתוחות, ישיבה הבאה ומספר מסמכים — כל הנתונים החשובים במבט אחד.",
    position: "bottom",
  },
  {
    id: "portal-status",
    type: "highlight",
    target: "portal-status",
    title: "מצב ניהול תקין",
    description: "לוח הבקרה המרכזי לציות — רואים את הציון לפי קטגוריות ואילו פריטים דורשים טיפול.",
    position: "bottom",
  },
  {
    id: "portal-urgent",
    type: "highlight",
    target: "portal-urgent",
    title: "משימות דחופות",
    description: "כל הפריטים שדורשים טיפול מוצגים כאן לפי דחיפות — ניתן לטפל ישירות מהדשבורד.",
    position: "top",
  },
  {
    id: "portal-calendar",
    type: "highlight",
    target: "portal-calendar",
    title: "מה בקרוב",
    description: "ישיבות, מועדי הגשה ותאריכים חשובים — הכל בתצוגה אחת כדי שלא תפספסו דבר.",
    position: "top",
  },
  {
    id: "notifications",
    type: "highlight",
    target: "notifications-bell",
    title: "התראות",
    description: "כאן תקבלו התראות על מועדים קרובים, אישורים שפגי תוקף ועדכונים חשובים.",
    position: "bottom-left",
  },
  {
    id: "completion",
    type: "completion",
    title: "כל הכבוד! סיימתם את הסיור 🌟",
    description: "עכשיו אתם מכירים את המערכת. תוכלו תמיד להפעיל את הסיור מחדש מהתפריט. בהצלחה!",
  },
];

export const adminTourSteps: TourStep[] = [
  {
    id: "welcome",
    type: "welcome",
    title: "ברוכים הבאים לפאנל הניהול! 🚀",
    description: "כאן תנהלו ארגונים, משתמשים, אינטגרציות ואוטומציות. בואו נסתכל על הכלים העיקריים.",
  },
  {
    id: "admin-sidebar",
    type: "highlight",
    target: "admin-sidebar",
    title: "תפריט ניהול",
    description: "גישה מהירה לכל מודולי הניהול — ארגונים, משתמשים, אוטומציות, דוחות ואינטגרציות.",
    position: "left",
    mobileSkip: true,
  },
  {
    id: "admin-stats",
    type: "highlight",
    target: "admin-stats",
    title: "סקירה כללית",
    description: "מספר ארגונים רשומים, משתמשים פעילים, בקשות ממתינות ואוטומציות — הכל במבט אחד.",
    position: "bottom",
  },
  {
    id: "admin-orgs",
    type: "highlight",
    target: "admin-orgs",
    title: "ניהול ארגונים",
    description: "רשימת הארגונים הרשומים עם הסטטוס שלהם, ניתן ללחוץ על ארגון לצפייה בפרטים.",
    position: "top",
  },
  {
    id: "admin-quicklinks",
    type: "highlight",
    target: "admin-quicklinks",
    title: "קישורים מהירים",
    description: "גישה מהירה לפעולות נפוצות — אישור בקשות, הוספת ארגון, הגדרת אוטומציות.",
    position: "top",
  },
  {
    id: "completion",
    type: "completion",
    title: "מוכנים להתחיל! ✅",
    description: "עכשיו אתם מכירים את פאנל הניהול. תוכלו תמיד להפעיל את הסיור מחדש מהתפריט.",
  },
];
