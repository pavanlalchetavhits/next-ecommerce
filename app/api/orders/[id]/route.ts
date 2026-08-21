import { NextResponse } from "next/server";

import {
    getOrderById,
    updateOrderStatus
} from '@/services/order.service';

type Params = {
    params: Promise<{
        id:string;
    }>
}

export async function GET(
    request:Request,
    { params}:Params
){
    try{
        const { id } = await params;

        const orderId = Number(id);

        if(!Number.isInteger(orderId))
        {
            return NextResponse.json(
                {
                    success:false,
                    message:'Invalid order id'
                },{
                   status:400 
                }
            )
        }

        const order = await getOrderById(orderId);

        if(!order)
        {
            return NextResponse.json(
                {
                    success:false,
                    message:'Order not found'
                },{
                    status:404
                }
            )
        }

        return NextResponse.json(
            {
                success:true,
                data:order
            }
        )
    }
    catch(error)
    {
        console.error('GET order error:',error);

        return NextResponse.json(
            {
                success:false,
                message:'Failed to fetch order'
            },{
                status:500
            }
        )
    }
}

export async function PATCH(
    request:Request,
    {params}:Params
)
{
    try{
        const {id} = await params;

        const orderId = Number(id);

        if(!Number.isInteger(orderId))
        {
            return NextResponse.json(
                {
                    success:false,
                    message:'Invalid order id'
                },{
                    status:400
                }
            )
        }

        const body = await request.json();

        if(!body.status)
        {
            return NextResponse.json(
                {
                    success:false,
                    message:'Order status is required'
                },{
                    status:400
                }
            )
        }

        await updateOrderStatus(
            orderId,
            body.status
        )

        return NextResponse.json(
            {
                success:true,
                message:'Order status updated successfully'
            }
        )
    }
    catch(error:any)
    {
        console.error('Update order error:',error);

        if (error.message === 'Invalid_Order_Status') {
            return NextResponse.json(
                {
                    success:false,
                    message:'Invalid order status'
                },{
                    status:400
                }
            )
        }

        return NextResponse.json(
            {
                success:false,
                message:'Failed to update order'
            }
        )
    }
}