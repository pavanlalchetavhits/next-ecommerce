import { NextResponse } from "next/server";
import {
    getProducts,
    createProduct
} from '@/services/product.service';

import { productSchema } from "@/lib/validations/products";

export async function GET() {
    try{
        const products = await getProducts();

        return NextResponse.json({
            success:true,
            data:products,
        })
    }
    catch(error)
    {   
        console.error('GET product error:',error);

        return NextResponse.json(
            {
                success:false,
                message:'Failed to fetch products'
            },{
                status: 500
            }
        )
    }
}

export async function POST(request:Request){
    try{
        const body = await request.json();

        const validatedData = productSchema.parse(body);

        const result = await createProduct(validatedData);

        return NextResponse.json(
            {
                success:true,
                message:'Product created successfully',
                data:result
            },{
                status:201
            }
        )
    }
    catch(error)
    {
        console.error('POST product error:',error);

        if(error instanceof Error && error.name === 'ZodError')
        {
            return NextResponse.json(
                {
                    success:false,
                    message:'Validaton failed',
                    errors:error
                },
                {
                    status:400
                }
            )
        }

        return NextResponse.json(
            {
                success:false,
                message:'Failed to create products'
            },
            {
                status:500
            }
        )
    }
}