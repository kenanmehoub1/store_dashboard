import { NextResponse } from "next/server";
import { supabaseGet, supabasePatch } from "@/lib/supabase/api";

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

    // Fetch all products
    const products = await supabaseGet("products", "select=*");

    // Update each product with new SYP price
    const updates = products.map((p: any) =>
      supabasePatch("products", `id=eq.${p.id}`, {
        price_syp: p.price_usd * rate,
        updated_at: new Date().toISOString(),
      })
    );

    await Promise.all(updates);

    return NextResponse.json({ success: true, updated: products.length });
  } catch (error) {
    console.error("UPDATE RATES ERROR:", error);
    return NextResponse.json(
      { error: "حدث خطأ في تحديث الأسعار" },
      { status: 500 }
    );
  }
}
