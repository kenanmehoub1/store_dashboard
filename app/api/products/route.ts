import { NextResponse } from "next/server";
import { supabaseGet, supabasePost } from "@/lib/supabase/api";

// Helper to convert snake_case to camelCase
function toCamelCase(products: any[]) {
  return products.map((p) => ({
    id: p.id,
    productName: p.product_name,
    priceUSD: p.price_usd,
    priceSYP: p.price_syp,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  }));
}

// ================= GET =================
export async function GET() {
  try {
    const products = await supabaseGet(
      "products",
      "select=*&order=created_at.desc"
    );
    return NextResponse.json(toCamelCase(products));
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);
    return NextResponse.json(
      { error: "حدث خطأ في جلب المنتجات" },
      { status: 500 }
    );
  }
}

// ================= POST =================
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const productName = body.productName?.trim();
    const priceUSD = Number(body.priceUSD);
    const exchangeRate = Number(body.exchangeRate || 0);

    if (!productName || priceUSD <= 0) {
      return NextResponse.json(
        { error: "بيانات غير صالحة" },
        { status: 400 }
      );
    }

    const priceSYP = exchangeRate > 0 ? priceUSD * exchangeRate : 0;

    const result = await supabasePost("products", {
      product_name: productName,
      price_usd: priceUSD,
      price_syp: priceSYP,
    });

    const product = result[0] || result;
    return NextResponse.json(toCamelCase([product])[0], { status: 201 });
  } catch (error: any) {
    console.error("POST PRODUCTS ERROR:", error);
    return NextResponse.json(
      { error: error?.message || "حدث خطأ في إضافة المنتج" },
      { status: 500 }
    );
  }
}