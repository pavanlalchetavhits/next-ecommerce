import { NextResponse } from "next/server";

import {
    getProductVarients,
    createProductVarient
} from '@/services/product-variant.service';

import { productVariantSchema } from "@/lib/validations/product-variant";
import { success } from "zod";

type Params = {
    params:Promise<{
        id:string;
    }>;
}

export async function GET(
    request:Request,
    { params}:Params
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
        const varients = await getProductVarients(productId);

        return NextResponse.json(
            {
                success:true,
                data:varients
            }
        )
    }
    catch(error){
        console.error('GET varients error:',error);

        return NextResponse.json(
            {
                success:false,
                message:'Failed to fetch varients'
            },
            {
                status:500
            }
        )
    }
}

export async function POST(
    request:Request,
    { params}: Params
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
                },
                {
                    status:400
                }
            )
        }

        const body = await request.json();

        const validateData = productVariantSchema.parse(body);

        const result = await createProductVarient(
            productId,
            validateData
        );  

        return NextResponse.json(
            {
                success:true,
                message:'Product variant created successfully',
                data:result
            },
            {
                status:201
            }
        )
    }   
    catch(error)
    {
        console.error('Create variant error:',error);

        return NextResponse.json(
            {
                success:false,
                message:'Failed to create variant',
            },{
                status:500
            }
        )
    }
}