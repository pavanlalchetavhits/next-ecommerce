import { NextResponse } from 'next/server';
import {
  getAllInventory,
  upsertInventoryStock,
} from '@/services/inventory.service';

export async function GET() {
  try {
    const inventory = await getAllInventory();

    return NextResponse.json({
      success: true,
      data: inventory,
    });
  } catch (error) {
    console.error('GET /api/inventory error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch inventory',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const productId = Number(body.product_id);
    if (!productId || isNaN(productId)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Valid product_id is required',
        },
        { status: 400 }
      );
    }

    const quantity = Number(body.quantity);
    if (isNaN(quantity) || quantity < 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Quantity must be a valid non-negative number',
        },
        { status: 400 }
      );
    }

    const lowStockThreshold =
      body.low_stock_threshold !== undefined
        ? Number(body.low_stock_threshold)
        : 5;

    await upsertInventoryStock({
      inventory_id: body.inventory_id ? Number(body.inventory_id) : null,
      product_id: productId,
      variant_id: body.variant_id ? Number(body.variant_id) : null,
      quantity: quantity,
      reserved_quantity: body.reserved_quantity
        ? Number(body.reserved_quantity)
        : 0,
      low_stock_threshold: isNaN(lowStockThreshold) ? 5 : lowStockThreshold,
    });

    return NextResponse.json({
      success: true,
      message: 'Inventory updated successfully',
    });
  } catch (error) {
    console.error('PUT /api/inventory error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update inventory',
      },
      { status: 500 }
    );
  }
}
