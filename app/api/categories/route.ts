import { NextResponse } from "next/server";
import {
    getCategories,
    createCategory,
} from '@/services/category.service';

import { categorySchema } from "@/lib/validations/category";

export async function GET() {
    try{
        const categories = await getCategories();
        return NextResponse.json({
            success:true,
            data:categories
        });
    }
    catch(error)
    {
        console.error('GET categories error:',error);
        return NextResponse.json({
            success:false,
            message:'Falied to fetch categories',
        },{
            status:500
        })
    }
}

export async function POST(request:Request){
    try{
        const body = await request.json();

        const validatedData = categorySchema.parse(body);

        const result = await createCategory(validatedData);

        return NextResponse.json({
            success:true,
            message:'Category created successfully',
            data:result,
        },{status:201})
    }
    catch(error)
    {
        console.error('POST category error:',error);

        if(error instanceof Error && error.name === 'ZodError') {
            return NextResponse.json({
                success:false,
                message:'Validaton failed',
                error:error
            },
            {status:400
            }
        )}

        return NextResponse.json(
            {
                success:false,
                message:'Failed to create category'
            },
            {status:500}
        )
    }
}