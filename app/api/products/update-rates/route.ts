import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { exchangeRate } = await request.json();
    const rate = Number(exchangeRate);

    if (!rate || rate <= 0) {
      return NextResponse.json(
        { error: "سعر الصرف غير صالح" },
        { status: 400 }
      );
    }

    // Update all products using raw query for efficiency
    await prisma.$executeRaw`
      UPDATE products
      SET price_syp = price_usd * ${rate},
          updated_at = NOW()
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("UPDATE RATES ERROR:", error);
    return NextResponse.json(
      { error: "حدث خطأ في تحديث الأسعار" },
      { status: 500 }
    );
  }
}
