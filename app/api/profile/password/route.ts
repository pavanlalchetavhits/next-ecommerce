import { NextResponse } from "next/server";
import { auth } from '@/lib/auth';
import bcrypt from 'bcrypt';
import db from "@/lib/db";

export async function PUT(request:Request){
    try{
        const session = await auth();

        if(!session?.user?.id)
        {
            return NextResponse.json(
                {
                    success:false,
                    message:'Unauthorized'
                },{
                    status:401
                }
            )
        }

        const userId = Number(session.user.id);

        const body = await request.json();

        const currentPassword = typeof body.currentPassword === 'string'
        ? body.currentPassword
        : '';

        const newPassword = typeof body.newPassword === 'string'
        ?  body.newPasword
        :  "";

        if(!currentPassword || !newPassword){
            return NextResponse.json(
                {
                    success:false,
                    message:'Current and new Password are required'
                },{
                    status:400
                }
            )
        }

        const [rows] = await db.query(`
            select password
            from users
            where id = ?
            limit 1
        `,[userId])


        const users = rows as any[];

        if(users.length === 0){

            return NextResponse.json(
                {
                    success:false,
                    message:'User not found'
                },{
                    status:404
                }
            )
        }

        const passwordMatches = await bcrypt.compare(currentPassword,users[0].password);

        if(!passwordMatches)
        {
            return NextResponse.json(
                {
                    success:false,
                    message:'Current Password is incorrect'
                },{
                    status:400
                }
            )
        }

        const hashedPassword = await bcrypt.hash(newPassword,10);

        await db.query(`
            update users set password = ? where id = ?
        `,[hashedPassword,userId])

        return NextResponse.json(
            {
                success:true,
                message:'Password changed successfully'
            },{
                status:201
            }
        )
    }
    catch(error)
    {
        console.error('Password update error:',error);

        return NextResponse.json(
            {
                success:false,
                message:'Failed to change password'
            },{
                status:500
            }
        )
    }
}