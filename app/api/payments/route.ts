import { NextResponse } from "next/server";

import {
    getPayment,
} from '../../../services/payment.service';

export async function GET(request:Request){
    try{
        const { searchParams } = new URL(request.url);

        const search = searchParams.get('search') || undefined;

        const status = searchParams.get('status') || undefined;

        const payment_gateway = searchParams.get("payment_geteway") || undefined;

        const allowedStatuses = [
            'pending',
            'processing',
            'success',
            'failed',
            'refunded'
        ]

        const allowedGatways = [
            'razopay',
            'cashfree',
            'cod',
        ];

        if(status && !allowedStatuses.includes(status))
        {
            return NextResponse.json(
                {
                    success:false,
                    message:'Invalid payment status',
                },{
                    status:400
                }
            )
        }

        if(payment_gateway && !allowedGatways.includes(payment_gateway))
        {
            return NextResponse.json(
                {
                    success:false,
                    message:'Invalid payment gateway'
                },{
                    status:400
                }
            )
        }

        const payments = await getPayment({search,status,payment_gateway});

        return NextResponse.json({
            success:true,
            data:payments,  
        })
    }
    catch(error){
        console.error('GET payments error:',error);

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