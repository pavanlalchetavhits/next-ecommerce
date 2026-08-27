import crypto from 'crypto';
import db from '@/lib/db';

export async function createPasswordRestToken(userId:number){

    await db.query(`
      delete from password_reset_tokens
      where user_id = ?  
    `,[userId]);

    const token = crypto.randomBytes(32).toString('hex');

    const tokenHash = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    const expriesAt = new Date(
        Date.now() + 30 * 60 * 1000
    );

    await db.query(`
      insert into password_reset_tokens (
        user_id,
        token_hash,
        expries_at
      )  Values(?,?,?)
    `,[userId,tokenHash,expriesAt]);

    return token;
}

export async function getValidPasswordResetToken(
    token:string
){
    const tokenHash = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex')
        
    const [rows] = await db.query(`
        select
            id,
            user_id,
            token_hash,
            expries_at,
            used_at
        from password_reset_tokens
        where token_hash = ?
        and used_at is null
        and expries_at > now()
        limit 1 
    `,[tokenHash]);

    const tokens = rows as any[];

    return tokens.length > 0
    ? token[0] : null;
}

export async function consumePasswordResetToken(tokenId:number){
    
    await db.query(`
        update password_reset_tokens
        set used_at = NOW()
        where id = ?
    `,[tokenId])
}