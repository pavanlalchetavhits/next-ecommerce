import { NextResponse } from "next/server";

import {
  addProductImage,
  getProductImages,
} from "@/services/product-image.service";

type Params = {
  params: Promise<{
    id: string;
  }>;
};


export async function GET(
  request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;

    const productId = Number(id);

    if (!Number.isInteger(productId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid product ID",
        },
        { status: 400 }
      );
    }

    const images = await getProductImages(productId);

    return NextResponse.json({
      success: true,
      data: images,
    });
  } catch (error) {
    console.error("Get product images error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch product images",
      },
      { status: 500 }
    );
  }
}


export async function POST(
  request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;

    const productId = Number(id);

    if (!Number.isInteger(productId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid product ID",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    if (!body.image_url) {
      return NextResponse.json(
        {
          success: false,
          message: "image_url is required",
        },
        { status: 400 }
      );
    }

    const result = await addProductImage({
      product_id: productId,
      image_url: body.image_url,
      alt_text: body.alt_text,
      is_primary: body.is_primary,
      sort_order: body.sort_order,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product image added successfully",
        data: result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add product image error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to add product image",
      },
      { status: 500 }
    );
  }
}