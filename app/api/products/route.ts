import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ================= GET =================
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
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

    // validation
    if (!productName || priceUSD <= 0) {
      return NextResponse.json(
        { error: "بيانات غير صالحة" },
        { status: 400 }
      );
    }

    const priceSYP =
      exchangeRate > 0 ? priceUSD * exchangeRate : 0;

    const product = await prisma.product.create({
      data: {
        productName,
        priceUSD,
        priceSYP,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("POST PRODUCTS ERROR:", error);

    return NextResponse.json(
      { error: "حدث خطأ في إضافة المنتج" },
      { status: 500 }
    );
  }
}