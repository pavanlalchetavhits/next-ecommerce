import { NextResponse } from "next/server";

import {
    getProductById,
    updateProduct,
    deleteProduct
} from '@/services/product.service';

import { productSchema } from "@/lib/validations/products";
import { success } from "zod";

type Paramas = {
    params: Promise<{
        id:string
    }>
}

export async function GET(
    request:Request,
    {params}: Paramas
) {
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

        const product = await getProductById(productId);

        return NextResponse.json({
            success:true,
            data:product
        })
    }
    catch(error)
    {
        console.error('GET product error:',error);

        return NextResponse.json(
            {
                success:false,
                message:'Failed to fetch product'
            },{
                status:500
            }
        )
    }
}

export async function PUT(
    request:Request,
    {params}: Paramas
){
    try{
        const {id} = await params;
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

        const validateData = productSchema.parse(body);

        await updateProduct(productId,validateData);

        return NextResponse.json(
            {
                success:true,
                message:'Product updated successfully'
            }
        )
    }
    catch(error){
        console.error('PUT product error:',error);

        return NextResponse.json(
            {
                success:false,
                message:'Failed to update product'
            },{
                status:500
            }
        )
    }
}

export async function DELETE(
    request:Request,
    {params}:Paramas
)
{
    try{
        const {id} = await params;
        const productId = Number(id);

        if(!Number.isInteger(productId))
        {
            return NextResponse.json(
                {
                    success:false,
                    message:'Invalid product Id'
                },{
                    status:400
                }
            )
        }

        await deleteProduct(productId);

        return NextResponse.json(
            {
                success:true,
                message:'Product deleted successfully'
            }
        )
    }
    catch(error)
    {
        console.error('Delete product error:',error);

        return NextResponse.json(
            {
                success:false,
                message:'Failed to delete product'
            },{
                status:500
            }
        )
    }
}