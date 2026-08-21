import { NextResponse } from "next/server";

import {
    getProductInventroy,
    createInventory,
} from '@/services/inventory.service';

type Params = {
    params: Promise<{
        id:string;
    }>;
}

export async function GET(
    request: Request,
    {params}: Params
)
{
    try{
        const { id } = await params;
        const productId = Number(id);

        if(!Number.isInteger(productId))
        {
            return NextResponse.json(
                {
                    success:false,
                    message:'Invalid product id'
                },{
                    status:400
                }
            )
        }

        const  inventory = await getProductInventroy(productId);

        return NextResponse.json({
            success:true,
            data:inventory
        })
    }
    catch(error)
    {
        console.error('Get invertory error:',error);

        return NextResponse.json(
            {
                success:false,
                message:'Failed to fetch inventory'
            },{
                status:500
            }
        )
    }
}


export async function POST(
    request:Request,
    { params}:Params
)
{
    try{
        const { id } = await params;
        const productId = Number(id);

        if(!Number.isInteger(productId))
        {
            return NextResponse.json(
                {
                    success:false,
                    message:'Invalid product id'
                },{
                    status:400
                }
            )
        }

        const body = await request.json();

       const result = await createInventory({
            product_id: productId,
            variant_id: body.variant_id,
            quantity: body.quantity,
            reserved_quantity: body.reserved_quantity,
            low_stock_threshold: body.low_stock_threshold,
        });

        return NextResponse.json(
            {
                success:true,
                message:'Inventory created successfully',
                data:result
            },{
                status:201
            }
        )
    }
    catch(error)
    {
        console.error('Create inventory error:',error);

        return NextResponse.json(
            {
                success:false,
                message:'Failed to create inventory'
            },{
                status:500  
            }
        )
    }
}