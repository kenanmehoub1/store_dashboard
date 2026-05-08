// app/api/products/[id]/route.ts

import { NextResponse } from "next/server";
import { supabasePatch, supabaseDelete } from "@/lib/supabase/api";

// PUT - تحديث منتج
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { productName, priceUSD, exchangeRate } = body;
    const priceSYP = priceUSD * exchangeRate;

    const result = await supabasePatch(
      "products",
      `id=eq.${id}`,
      {
        product_name: productName,
        price_usd: priceUSD,
        price_syp: priceSYP,
        updated_at: new Date().toISOString(),
      }
    );

    const product = result[0] || result;
    return NextResponse.json({
      id: product.id,
      productName: product.product_name,
      priceUSD: product.price_usd,
      priceSYP: product.price_syp,
      createdAt: product.created_at,
      updatedAt: product.updated_at,
    });
  } catch (error) {
    console.error("PUT PRODUCT ERROR:", error);
    return NextResponse.json(
      { error: "حدث خطأ في تحديث المنتج" },
      { status: 500 },
    );
  }
}

// DELETE - حذف منتج
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await supabaseDelete("products", `id=eq.${id}`);

    return NextResponse.json({ message: "تم حذف المنتج بنجاح" });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    return NextResponse.json(
      { error: "حدث خطأ في حذف المنتج" },
      { status: 500 },
    );
  }
}

