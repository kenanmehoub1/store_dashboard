// app/api/products/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // تأكد من المسار الصحيح

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("خطأ في جلب المنتجات:", error);
    return NextResponse.json(
      { error: "حدث خطأ في جلب المنتجات" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productName, priceUSD, exchangeRate } = body;

    if (!productName || !priceUSD) {
      return NextResponse.json(
        { error: "اسم المنتج والسعر مطلوبان" },
        { status: 400 },
      );
    }

    const priceSYP = priceUSD * exchangeRate;

    const product = await prisma.product.create({
      data: {
        productName,
        priceUSD,
        priceSYP,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("خطأ في إضافة المنتج:", error);
    return NextResponse.json(
      { error: "حدث خطأ في إضافة المنتج" },
      { status: 500 },
    );
  }
}
