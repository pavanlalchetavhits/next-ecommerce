import { NextResponse } from "next/server";

import {
    getPaymentById
} from '@/services/payment.service';

type RouteContext = {
    params:Promise<{
        id:string;
    }>
}

export async function GET(
    request:Request,
    context:RouteContext
){
    try{
        const {id} = await context.params;

        const paymentId = Number(id);

        if(!Number.isInteger(paymentId) || paymentId < 0){
            return NextResponse.json(
                {
                    success:false,
                    message:'Invalid payment id'
                },{
                    status:400
                }
            )
        }

        const payment = await getPaymentById(paymentId);

        if(!payment)
        {
            return NextResponse.json(
                {
                    success:false,
                    message:'Payment not found'
                },{
                    status:404
                }
            )
        }

        return NextResponse.json(
            {
                success:true,
                data:payment
            }
        )
    }
    catch(error) {
        console.error('Get payment details error:',error);

        return NextResponse.json(
            {
                success:false,
                message:'Failed to fetch payment'
            },{
                status:500
            }
        )
    }
}