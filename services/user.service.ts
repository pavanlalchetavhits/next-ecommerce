import brcypt from 'bcrypt';
import db from '@/lib/db';
import { RegisterInput } from '@/lib/validations/user';

export async function findUserByEmail(email:string)
{
    const [rows] = await db.query(`
        select
            id,
            name,
            email,
            password,
            phone,
            role,
            status,
            last_login_at,
            created_at
        from users
        where email = ? 
        limit 1
    `,[email])

    const users = rows as any[];

    return users.length > 0 ? users[0] : null;
}

export async function findUserById(id:number)
{
    const [rows] = await db.query(`
        select
            id,
            name,
            email,
            phone,
            role,
            status,
            last_login_at
        from users
        where id = ?
        limit 1    
    `,[id])

    const users = rows as any[];

    return users.length > 0 ? users[0] : null;
}

export async function createUser(data:RegisterInput)
{
    const exisitingUser = await findUserByEmail(data.email);

    if(exisitingUser)
    {
        throw new Error('Email Already Exists');
    }

    const hashedPassword = await brcypt.hash(
        data.password,
        10
    );

    const [result] = await db.query(`
        insert into users(
            name,
            email,
            password,
            phone,
            role,
            status
        )  values (?,?,?,?,'user','active') 
    `,[
        data.name,
        data.email,
        hashedPassword,
        data.phone || null
    ])

    return result;
}