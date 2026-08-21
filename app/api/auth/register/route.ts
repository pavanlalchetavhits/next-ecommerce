import { NextResponse } from "next/server";

import {
    createUser,
} from '@/services/user.service';

import { registerSchema } from "@/lib/validations/user";

export async function POST(request:Request)
{
    try{
        const body = await request.json();

        const validatedData = registerSchema.parse(body);

        const result = await createUser(validatedData)
    
        return NextResponse.json(
            {
                success:true,
                message:'Registeration successfull',
                data:{
                    id:(result as any).insertId,
                },
            },{
                status:201
            }
        )
    }
    catch(error)
    {
        console.error('Registration error:',error);

        if(error instanceof Error && error.name === 'ZodError')
        {
            return NextResponse.json(
                {
                    success:false,
                    message:'Validation failed',
                    error:error,
                },{
                    status:400
                }
            )
        }

        if(error instanceof Error && error.message === 'Email Already Exists')
        {
            return NextResponse.json(
                {
                    success:false,
                    message:'Email is already registered'
                },{
                    status:409
                }
            )
        }

        return NextResponse.json(
            {
                success:false,
                message:'Registration failed',
            },
            {
                status:500
            }
        )
    }
}