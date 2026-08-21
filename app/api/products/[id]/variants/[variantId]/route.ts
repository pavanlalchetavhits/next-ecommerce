import { NextResponse } from "next/server";

import {
    updateProductVariant,
    deleteProdcutVariant
} from '@/services/product-variant.service';

import { productVariantSchema } from "@/lib/validations/product-variant";

type Params = {
    params: Promise<{
        id: string;
        variantId: string;
    }>
}

export async function PUT(
    request: Request,
    { params }: Params
){
    try{
        const { variantId } = await params;

        const id = Number(variantId);

        if(!Number.isInteger(id))
        {
            return NextResponse.json(
                {
                    success:false,
                    message:'Invalid varient id'
                },{
                    status:400
                }
            )
        }

        const body = await request.json();

        const validateDate = productVariantSchema.parse(body);

        await updateProductVariant(id,validateDate);

        return NextResponse.json({
            success:true,
            message:'Varient updated successfully'
        })
    }
    catch(error)
    {
        console.error('Update variant error:',error);

        return NextResponse.json(
            {
                success:false,
                message: 'Failed to update variant',
            },
            {status:500}
        )
    }
}

export async function DELETE(
    request:Request,
    {params}: Params
){
    try{
        const { variantId } = await params;

        const id = Number(variantId);

        if(!Number.isInteger(id)) 
        {
            return NextResponse.json(
                {
                    success:false,
                    message:'Invalid variant id'    
                },{
                    status:400
                }
            )
        }

        await deleteProdcutVariant(id);

        return NextResponse.json({
            success:true,
            message:'Varient deleted successfully'
        })
    }
    catch(error)
    {
        console.error('Delete varient error:',error);

        return NextResponse.json(
            {
                success:false,
                message:'Failed to delete varient'
            },{
                status:500
            }
        )
    }
}