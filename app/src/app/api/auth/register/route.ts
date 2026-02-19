import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const BCRYPT_ROUNDS = 10;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name, organizationName, organizationNumber } = body;

    if (!email || !password || !name || !organizationName) {
      return NextResponse.json(
        { success: false, error: "חסרים שדות חובה: אימייל, סיסמה, שם, שם עמותה" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "אימייל זה כבר רשום במערכת" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    const org = await prisma.organization.create({
      data: {
        name: organizationName,
        number: organizationNumber ?? null,
      },
    });

    await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: "MANAGER",
        organizationId: org.id,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      message: "הבקשה נשלחה. תקבל עדכון במייל לאחר אישור.",
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { success: false, error: "שגיאה ברישום" },
      { status: 500 }
    );
  }
}
