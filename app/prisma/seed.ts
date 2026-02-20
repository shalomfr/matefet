import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ==================== ADMIN USER ====================
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@matefet.co.il";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin123!";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      name: "מנהל מערכת",
      role: "ADMIN",
    },
  });
  console.log(`Admin: ${admin.email}`);

  // ==================== ORGANIZATION ====================
  const org = await prisma.organization.upsert({
    where: { id: "org-or-letzion" },
    update: {},
    create: {
      id: "org-or-letzion",
      name: "עמותת אור לציון",
      number: "580123456",
      address: "רחוב הרצל 15, ירושלים",
      phone: "02-6234567",
      email: "info@or-letzion.org.il",
    },
  });
  console.log(`Organization: ${org.name}`);

  // ==================== MANAGER USER ====================
  const managerHash = await bcrypt.hash("Manager123!", 10);
  const manager = await prisma.user.upsert({
    where: { email: "yossi@or-letzion.org.il" },
    update: {},
    create: {
      email: "yossi@or-letzion.org.il",
      passwordHash: managerHash,
      name: "יוסי לוי",
      role: "MANAGER",
      status: "APPROVED",
      organizationId: org.id,
    },
  });
  console.log(`Manager: ${manager.email}`);

  // ==================== DONORS ====================
  const donors = await Promise.all([
    prisma.donor.create({
      data: {
        organizationId: org.id,
        firstName: "אברהם",
        lastName: "כהן",
        email: "avraham@example.com",
        phone: "050-1234567",
        city: "ירושלים",
        totalDonated: 15000,
        donationCount: 5,
      },
    }),
    prisma.donor.create({
      data: {
        organizationId: org.id,
        firstName: "שרה",
        lastName: "לוי",
        email: "sarah@example.com",
        phone: "052-9876543",
        city: "תל אביב",
        totalDonated: 8500,
        donationCount: 3,
      },
    }),
    prisma.donor.create({
      data: {
        organizationId: org.id,
        firstName: "משה",
        lastName: "ישראלי",
        email: "moshe@example.com",
        phone: "054-5551234",
        city: "חיפה",
        totalDonated: 25000,
        donationCount: 12,
      },
    }),
    prisma.donor.create({
      data: {
        organizationId: org.id,
        firstName: "רחל",
        lastName: "אברמוביץ",
        email: "rachel@example.com",
        phone: "053-7778899",
        city: "בני ברק",
        totalDonated: 5000,
        donationCount: 2,
      },
    }),
    prisma.donor.create({
      data: {
        organizationId: org.id,
        firstName: "דוד",
        lastName: "מזרחי",
        email: "david@example.com",
        phone: "058-3334455",
        city: "באר שבע",
        totalDonated: 42000,
        donationCount: 8,
      },
    }),
  ]);
  console.log(`Created ${donors.length} donors`);

  // ==================== CAMPAIGNS ====================
  const campaign = await prisma.campaign.create({
    data: {
      organizationId: org.id,
      name: "קמפיין חנוכה תשפ״ו",
      description: "קמפיין גיוס תרומות לחנוכה",
      goalAmount: 100000,
      raisedAmount: 67500,
      isActive: true,
      startDate: new Date("2025-12-01"),
      endDate: new Date("2026-01-15"),
    },
  });

  // ==================== DONATIONS ====================
  const now = new Date();
  const donations = [];
  for (let i = 0; i < 15; i++) {
    const donor = donors[i % donors.length];
    const daysAgo = Math.floor(Math.random() * 90);
    const amount = [500, 1000, 1800, 2500, 3600, 5000, 10000][Math.floor(Math.random() * 7)];
    donations.push(
      await prisma.donation.create({
        data: {
          organizationId: org.id,
          donorId: donor.id,
          amount,
          status: "COMPLETED",
          method: ["credit_card", "bank_transfer", "cash", "check"][Math.floor(Math.random() * 4)],
          campaignId: i < 5 ? campaign.id : null,
          donatedAt: new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000),
        },
      })
    );
  }
  console.log(`Created ${donations.length} donations`);

  // ==================== RECEIPTS ====================
  await prisma.receipt.create({
    data: {
      organizationId: org.id,
      receiptNumber: 1001,
      recipientName: "אברהם כהן",
      amount: 5000,
      isTaxDeductible: true,
      section46: true,
    },
  });

  // ==================== DOCUMENT SEQUENCES ====================
  await prisma.documentSequence.create({
    data: { organizationId: org.id, type: "receipt", lastNumber: 1001, prefix: "R" },
  });
  await prisma.documentSequence.create({
    data: { organizationId: org.id, type: "invoice", lastNumber: 100, prefix: "INV" },
  });

  // ==================== BUDGET ====================
  const budget = await prisma.budget.create({
    data: {
      organizationId: org.id,
      year: 2026,
      name: "תקציב שנתי 2026",
      totalBudget: 500000,
      totalSpent: 187500,
      lines: {
        create: [
          { category: "משכורות", planned: 200000, actual: 95000 },
          { category: "שכירות", planned: 60000, actual: 30000 },
          { category: "פעילויות", planned: 80000, actual: 32500 },
          { category: "שיווק", planned: 40000, actual: 15000 },
          { category: "הנהלה וכלליות", planned: 50000, actual: 10000 },
          { category: "תחבורה", planned: 30000, actual: 5000 },
          { category: "אחר", planned: 40000, actual: 0 },
        ],
      },
    },
  });
  console.log(`Budget: ${budget.name}`);

  // ==================== BOARD MEMBERS ====================
  const boardMembers = await Promise.all([
    prisma.boardMember.create({
      data: { organizationId: org.id, name: "הרב יוסף כהן", role: "יו״ר", email: "yosef@example.com", phone: "050-1111111" },
    }),
    prisma.boardMember.create({
      data: { organizationId: org.id, name: "מרים לוי", role: "גזברית", email: "miriam@example.com", phone: "052-2222222" },
    }),
    prisma.boardMember.create({
      data: { organizationId: org.id, name: "שמעון ישראלי", role: "מזכיר", email: "shimon@example.com", phone: "054-3333333" },
    }),
    prisma.boardMember.create({
      data: { organizationId: org.id, name: "דבורה אברמוביץ", role: "חברת ועד", email: "devora@example.com" },
    }),
    prisma.boardMember.create({
      data: { organizationId: org.id, name: "נתנאל מזרחי", role: "חבר ועד", email: "netanel@example.com" },
    }),
  ]);
  console.log(`Created ${boardMembers.length} board members`);

  // ==================== BOARD MEETINGS ====================
  const pastMeeting = await prisma.boardMeeting.create({
    data: {
      organizationId: org.id,
      title: "ישיבת ועד מנהל - רבעון 4",
      date: new Date("2026-01-15T18:00:00"),
      location: "משרדי העמותה",
      status: "COMPLETED",
      summary: "דנו בתקציב 2026, אושר פה אחד. סוכם לקדם קמפיין חנוכה.",
      attendeesCount: 5,
      protocol: {
        create: {
          content: "פרוטוקול ישיבת ועד מנהל מתאריך 15.01.2026\nנוכחים: כל חברי הועד\nסדר יום: אישור תקציב 2026, קמפיין חנוכה\nהחלטות: אושר תקציב 500,000 ש\"ח לשנת 2026",
          approvedAt: new Date("2026-01-16"),
        },
      },
    },
  });

  await prisma.boardMeeting.create({
    data: {
      organizationId: org.id,
      title: "ישיבת ועד מנהל - רבעון 1",
      date: new Date("2026-03-15T18:00:00"),
      location: "משרדי העמותה",
      status: "SCHEDULED",
    },
  });

  await prisma.boardMeeting.create({
    data: {
      organizationId: org.id,
      title: "אסיפה כללית שנתית",
      date: new Date("2026-04-20T17:00:00"),
      location: "אולם הכנסים",
      status: "SCHEDULED",
    },
  });

  // ==================== BOARD RESOLUTIONS ====================
  await prisma.boardResolution.create({
    data: {
      organizationId: org.id,
      meetingId: pastMeeting.id,
      title: "אישור תקציב 2026",
      description: "אישור תקציב שנתי בסך 500,000 ש\"ח",
      status: "approved",
      votesFor: 5,
      votesAgainst: 0,
      votesAbstain: 0,
      decidedAt: new Date("2026-01-15"),
    },
  });

  await prisma.boardResolution.create({
    data: {
      organizationId: org.id,
      meetingId: pastMeeting.id,
      title: "השקת קמפיין חנוכה",
      description: "אישור השקת קמפיין גיוס תרומות לחנוכה ביעד 100,000 ש\"ח",
      status: "approved",
      votesFor: 4,
      votesAgainst: 0,
      votesAbstain: 1,
      decidedAt: new Date("2026-01-15"),
    },
  });

  // ==================== COMPLIANCE ITEMS ====================
  await Promise.all([
    prisma.complianceItem.create({
      data: {
        organizationId: org.id, name: "אישור ניהול תקין", type: "CERTIFICATE",
        status: "OK", dueDate: new Date("2026-12-31"), completedAt: new Date("2026-01-10"),
      },
    }),
    prisma.complianceItem.create({
      data: {
        organizationId: org.id, name: "דוח שנתי לרשם העמותות", type: "REPORT",
        status: "WARNING", dueDate: new Date("2026-03-31"), description: "יש להגיש עד סוף מרץ",
      },
    }),
    prisma.complianceItem.create({
      data: {
        organizationId: org.id, name: "דוח כספי מבוקר", type: "REPORT",
        status: "OK", dueDate: new Date("2026-06-30"), completedAt: new Date("2026-02-01"),
      },
    }),
    prisma.complianceItem.create({
      data: {
        organizationId: org.id, name: "רישום ברשם העמותות", type: "REGISTRATION",
        status: "OK", completedAt: new Date("2020-03-15"),
      },
    }),
    prisma.complianceItem.create({
      data: {
        organizationId: org.id, name: "פרוטוקול מינוי נושאי משרה", type: "DOCUMENT",
        status: "OK", completedAt: new Date("2025-11-01"),
      },
    }),
    prisma.complianceItem.create({
      data: {
        organizationId: org.id, name: "אישור מס הכנסה סעיף 46", type: "APPROVAL",
        status: "OK", dueDate: new Date("2026-12-31"), completedAt: new Date("2026-01-05"),
      },
    }),
    prisma.complianceItem.create({
      data: {
        organizationId: org.id, name: "ביטוח אחריות מקצועית", type: "CERTIFICATE",
        status: "WARNING", dueDate: new Date("2026-04-15"), description: "פוליסה מתחדשת באפריל",
      },
    }),
    prisma.complianceItem.create({
      data: {
        organizationId: org.id, name: "רישום מע\"מ", type: "REGISTRATION",
        status: "OK", completedAt: new Date("2020-03-15"),
      },
    }),
  ]);
  console.log("Created 8 compliance items");

  // ==================== COMPLIANCE CERTIFICATES ====================
  await prisma.complianceCertificate.create({
    data: {
      organizationId: org.id, name: "אישור ניהול תקין 2026",
      issuedBy: "רשם העמותות", issuedAt: new Date("2026-01-10"),
      expiresAt: new Date("2026-12-31"), status: "OK",
    },
  });

  // ==================== DOCUMENTS ====================
  await Promise.all([
    prisma.organizationDocument.create({ data: { organizationId: org.id, name: "תקנון העמותה", category: "FOUNDING", description: "תקנון מעודכן" } }),
    prisma.organizationDocument.create({ data: { organizationId: org.id, name: "אישור ניהול תקין 2026", category: "COMPLIANCE" } }),
    prisma.organizationDocument.create({ data: { organizationId: org.id, name: "דוח כספי 2025", category: "FINANCIAL" } }),
    prisma.organizationDocument.create({ data: { organizationId: org.id, name: "פרוטוקול ישיבה ינואר 2026", category: "BOARD" } }),
    prisma.organizationDocument.create({ data: { organizationId: org.id, name: "רשימת חברי ועד", category: "BOARD" } }),
  ]);
  console.log("Created 5 documents");

  // ==================== VOLUNTEERS ====================
  await Promise.all([
    prisma.volunteer.create({
      data: {
        organizationId: org.id, name: "יעל גולדשטיין", email: "yael@example.com",
        phone: "050-9998877", role: "מתנדבת הוראה", totalHours: 48,
        hours: {
          create: [
            { date: new Date("2026-02-10"), hours: 4, description: "שיעור מתמטיקה", approved: true },
            { date: new Date("2026-02-12"), hours: 3, description: "חונכות", approved: true },
          ],
        },
      },
    }),
    prisma.volunteer.create({
      data: { organizationId: org.id, name: "אליהו ברקוביץ", email: "eli@example.com", phone: "052-6665544", role: "מתנדב לוגיסטיקה", totalHours: 32 },
    }),
    prisma.volunteer.create({
      data: { organizationId: org.id, name: "נועה שמיר", email: "noa@example.com", role: "מתנדבת שיווק", totalHours: 20 },
    }),
  ]);
  console.log("Created 3 volunteers");

  // ==================== WORKFLOWS ====================
  const wf1 = await prisma.workflow.create({
    data: {
      organizationId: org.id, name: "קבלה אוטומטית לתרומה",
      description: "שליחת קבלה אוטומטית כשמתקבלת תרומה חדשה",
      triggerType: "EVENT", triggerConfig: { eventType: "donation.created" },
      status: "ACTIVE", templateId: "donation-receipt", runCount: 12, lastRunAt: new Date("2026-02-18"),
      steps: {
        create: [
          { order: 1, actionType: "SEND_EMAIL", actionConfig: { to: "{{donorEmail}}", subject: "קבלה על תרומתך", html: "<div dir='rtl'><h2>תודה!</h2><p>סכום: {{amount}}</p></div>" } },
          { order: 2, actionType: "SEND_NOTIFICATION", actionConfig: { type: "SUCCESS", title: "תרומה חדשה", message: "{{amount}} מאת {{donorName}}" } },
        ],
      },
    },
  });

  const wf2 = await prisma.workflow.create({
    data: {
      organizationId: org.id, name: "תזכורת ניהול תקין",
      description: "שליחת תזכורת 30 יום לפני תום תוקף",
      triggerType: "SCHEDULE", triggerConfig: { cron: "0 9 * * 0" },
      status: "ACTIVE", templateId: "compliance-reminder-30", runCount: 4, lastRunAt: new Date("2026-02-16"),
      steps: {
        create: [
          { order: 1, actionType: "SEND_NOTIFICATION", actionConfig: { type: "WARNING", title: "תזכורת", message: "{{itemName}} יפוג בעוד {{daysLeft}} ימים" } },
          { order: 2, actionType: "SEND_EMAIL", actionConfig: { to: "{{managerEmail}}", subject: "תזכורת: {{itemName}}", html: "<div dir='rtl'>{{itemName}} יפוג בתאריך {{dueDate}}</div>" } },
        ],
      },
    },
  });

  const wf3 = await prisma.workflow.create({
    data: {
      organizationId: org.id, name: "סיכום ישיבת ועד",
      description: "שליחת סיכום אוטומטי בסיום ישיבת ועד",
      triggerType: "EVENT", triggerConfig: { eventType: "meeting.completed" },
      status: "ACTIVE", templateId: "meeting-summary", runCount: 1,
      steps: {
        create: [
          { order: 1, actionType: "SEND_EMAIL", actionConfig: { to: "{{attendeesEmails}}", subject: "סיכום: {{meetingTitle}}", html: "<div dir='rtl'>{{summary}}</div>" } },
          { order: 2, actionType: "CREATE_DOCUMENT", actionConfig: { name: "פרוטוקול - {{meetingTitle}}", category: "BOARD" } },
        ],
      },
    },
  });

  await prisma.workflow.create({
    data: {
      organizationId: org.id, name: "התראת חריגה מתקציב",
      description: "התראה כשההוצאות עוברות 80%",
      triggerType: "EVENT", triggerConfig: { eventType: "budget.threshold", conditions: { operator: "AND", rules: [{ field: "percentage", op: "gte", value: 80 }] } },
      status: "ACTIVE", templateId: "budget-threshold",
      steps: {
        create: [
          { order: 1, actionType: "SEND_NOTIFICATION", actionConfig: { type: "WARNING", title: "חריגה מתקציב", message: "ההוצאות הגיעו ל-{{percentage}}%" } },
        ],
      },
    },
  });

  await prisma.workflow.create({
    data: {
      organizationId: org.id, name: "דוח חודשי אוטומטי",
      description: "יצירת דוח בתחילת כל חודש",
      triggerType: "SCHEDULE", triggerConfig: { cron: "0 9 1 * *" },
      status: "INACTIVE", templateId: "monthly-report",
      steps: {
        create: [
          { order: 1, actionType: "CREATE_DOCUMENT", actionConfig: { name: "דוח חודשי", category: "FINANCIAL" } },
          { order: 2, actionType: "SEND_NOTIFICATION", actionConfig: { type: "INFO", title: "דוח חודשי מוכן", message: "הדוח החודשי מוכן" } },
        ],
      },
    },
  });
  console.log("Created 5 workflows");

  // ==================== WORKFLOW EXECUTIONS ====================
  for (let i = 0; i < 8; i++) {
    const wf = [wf1, wf2, wf3][i % 3];
    const daysAgo = Math.floor(Math.random() * 30);
    await prisma.workflowExecution.create({
      data: {
        organizationId: org.id, workflowId: wf.id,
        status: i === 5 ? "FAILED" : "SUCCESS",
        triggerData: { source: "seed" },
        startedAt: new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000),
        completedAt: new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000 + 2000),
        error: i === 5 ? "SMTP connection timeout" : null,
      },
    });
  }
  console.log("Created 8 workflow executions");

  // ==================== NOTIFICATIONS ====================
  await Promise.all([
    prisma.notification.create({
      data: { organizationId: org.id, userId: manager.id, type: "SUCCESS", title: "תרומה חדשה התקבלה", message: "תרומה בסך 5,000 ש\"ח מאת אברהם כהן" },
    }),
    prisma.notification.create({
      data: { organizationId: org.id, userId: manager.id, type: "WARNING", title: "תזכורת ניהול תקין", message: "דוח שנתי לרשם העמותות — נותרו 39 ימים" },
    }),
    prisma.notification.create({
      data: { organizationId: org.id, type: "INFO", title: "ישיבת ועד קרובה", message: "ישיבת ועד מנהל — רבעון 1 ב-15.03.2026" },
    }),
    prisma.notification.create({
      data: { organizationId: org.id, type: "SUCCESS", title: "דוח כספי אושר", message: "הדוח הכספי המבוקר לשנת 2025 אושר", isRead: true },
    }),
  ]);
  console.log("Created 4 notifications");

  // ==================== AUDIT LOG ====================
  await Promise.all([
    prisma.auditLog.create({ data: { organizationId: org.id, userId: manager.id, action: "create", entity: "donation", details: { amount: 5000 } } }),
    prisma.auditLog.create({ data: { organizationId: org.id, userId: manager.id, action: "update", entity: "complianceItem", details: { status: "OK" } } }),
    prisma.auditLog.create({ data: { organizationId: org.id, userId: manager.id, action: "create", entity: "boardMeeting", details: { title: "ישיבת ועד" } } }),
  ]);
  console.log("Created 3 audit logs");

  console.log("\nSeed completed!");
  console.log(`\nLogin credentials:`);
  console.log(`  Admin: ${adminEmail} / ${adminPassword}`);
  console.log(`  Manager: yossi@or-letzion.org.il / Manager123!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
