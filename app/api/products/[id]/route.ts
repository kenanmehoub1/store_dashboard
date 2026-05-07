// app/api/products/[id]/route.ts

import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";



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



    const product = await prisma.product.update({

      where: { id: parseInt(id) },

      data: {

        productName,

        priceUSD,

        priceSYP,

      },

    });



    return NextResponse.json(product);

  } catch (error) {

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
    await prisma.product.delete({
      where: { id: parseInt(id) },

    });



    return NextResponse.json({ message: "تم حذف المنتج بنجاح" });

  } catch (error) {

    return NextResponse.json(

      { error: "حدث خطأ في حذف المنتج" },

      { status: 500 },

    );

  }

}

