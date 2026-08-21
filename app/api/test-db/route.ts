import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET()
{
    try{
        const [rows] = await db.query('select 1 as result');

        return NextResponse.json({
            success:true,
            message:'Mysql connected successfully',
            data:rows
        })
    }
    catch(error){
        console.error('Database connection error:',error);

        return NextResponse.json(
            {
                success:false,
                message:'Database connection failed'
            },
            {
                status:500
            }
        )
    }
}