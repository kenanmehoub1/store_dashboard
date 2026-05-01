import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ================= PUT =================
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const productName = body.productName?.trim();
    const priceUSD = Number(body.priceUSD);
    const exchangeRate = Number(body.exchangeRate || 0);

    const priceSYP =
      exchangeRate > 0 ? priceUSD * exchangeRate : 0;

    const product = await prisma.product.update({
      where: {
        id: params.id, // ✅ بدون parseInt
      },
      data: {
        productName,
        priceUSD,
        priceSYP,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("PUT ERROR:", error);

    return NextResponse.json(
      { error: "حدث خطأ في تحديث المنتج" },
      { status: 500 }
    );
  }
}

// ================= DELETE =================
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.product.delete({
      where: {
        id: params.id, // ✅ بدون parseInt
      },
    });

    return NextResponse.json({
      message: "تم حذف المنتج بنجاح",
    });
  } catch (error) {
    console.error("DELETE ERROR:", error);

    return NextResponse.json(
      { error: "حدث خطأ في حذف المنتج" },
      { status: 500 }
    );
  }
}