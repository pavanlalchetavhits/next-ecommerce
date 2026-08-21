import { NextResponse } from "next/server";
import {
  getCategoriesById,
  updateCategory,
  deleteCategory,
} from "@/services/category.service";

import { categorySchema } from "@/lib/validations/category";
import { success } from "zod";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const categoryId = Number(id);

    if (!Number.isInteger(categoryId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid category id",
        },
        {
          status: 400,
        },
      );
    }

    const category = await getCategoriesById(categoryId);

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("GET category error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch category",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const categoryId = Number(id);

    if (!Number.isInteger(categoryId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid category id",
        },
        {
          status: 400,
        },
      );
    }

    const body = await request.json();
    const validatedData = categorySchema.parse(body);
    await updateCategory(categoryId, validatedData);

    return NextResponse.json({
      success: true,
      message: "Category updated successfully",
    });
  } catch (error) {
    console.error("PUT category error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update category",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const categoryId = Number(id);

    if (!Number.isInteger(categoryId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid category id",
        },
        {
          status: 400,
        },
      );
    }

    await deleteCategory(categoryId);
    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete category",
      },
      {
        status: 500,
      },
    );
  }
}
