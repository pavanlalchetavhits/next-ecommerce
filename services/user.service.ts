import brcypt from 'bcrypt';
import crypto from 'crypto';
import db from '@/lib/db';
import { RegisterInput } from '@/lib/validations/user';

export async function findUserByEmail(email: string) {
  const [rows] = await db.query(
    `
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
    `,
    [email]
  );

  const users = rows as any[];

  return users.length > 0 ? users[0] : null;
}

export async function findUserById(id: number) {
  const [rows] = await db.query(
    `
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
    `,
    [id]
  );

  const users = rows as any[];

  return users.length > 0 ? users[0] : null;
}

export async function createUser(data: RegisterInput) {
  const exisitingUser = await findUserByEmail(data.email);

  if (exisitingUser) {
    throw new Error('Email Already Exists');
  }

  const hashedPassword = await brcypt.hash(data.password, 10);

  const [result] = await db.query(
    `
        insert into users(
            name,
            email,
            password,
            phone,
            role,
            status
        )  values (?,?,?,?,'user','active') 
    `,
    [data.name, data.email, hashedPassword, data.phone || null]
  );

  return result;
}

/**
 * Format Date object to MySQL DATETIME format YYYY-MM-DD HH:MM:SS in local time
 */
function formatMySQLDateTime(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

/**
 * Generate password reset link valid for 10 minutes stored in password_reset_tokens
 */
export async function createPasswordResetLink(email: string, role?: string, baseUrl?: string) {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error('No account found with this email address.');
  }

  if (role && user.role !== role) {
    throw new Error(`No ${role} account found with this email address.`);
  }

  // Generate secure random 64-char hex token
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  // Token is valid for exactly 10 minutes in local DATETIME
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  const formattedExpiresAt = formatMySQLDateTime(expiresAt);

  // Insert reset token record into password_reset_tokens table
  await db.query(
    `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)`,
    [user.id, tokenHash, formattedExpiresAt]
  );

  // Fallback domain URL
  const appBaseUrl = baseUrl || process.env.NEXTAUTH_URL || process.env.AUTH_URL || 'http://localhost:3000';
  const cleanBaseUrl = appBaseUrl.replace(/\/+$/, '');

  // Determine path based on user role or portal
  const isTargetAdmin = user.role === 'admin' || role === 'admin';
  const path = isTargetAdmin ? '/admin/reset-password' : '/reset-password';
  const resetLink = `${cleanBaseUrl}${path}?token=${token}&email=${encodeURIComponent(user.email)}`;

  return {
    email: user.email,
    token,
    resetLink,
    expiresAt,
  };
}

/**
 * Reset password using valid 10-minute token stored in password_reset_tokens
 */
export async function resetUserPasswordWithToken(email: string, token: string, newPassword: string) {
  if (!email || !token) {
    throw new Error('Missing email or reset token in request.');
  }

  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error('Account not found.');
  }

  const tokenHash = crypto.createHash('sha256').update(token.trim()).digest('hex');

  // Find matching token that has not been used and has not expired (10 mins)
  const [rows] = await db.query(
    `SELECT id, expires_at, used_at FROM password_reset_tokens 
     WHERE user_id = ? AND token_hash = ? AND used_at IS NULL AND expires_at > NOW()
     ORDER BY id DESC LIMIT 1`,
    [user.id, tokenHash]
  );

  const tokenRecords = rows as any[];
  if (tokenRecords.length === 0) {
    throw new Error('Password reset link is invalid or has expired (10 minute limit). Please request a new link.');
  }

  const tokenRecord = tokenRecords[0];

  const hashedPassword = await brcypt.hash(newPassword, 10);

  // Update user password in users table
  await db.query(
    `UPDATE users SET password = ? WHERE id = ?`,
    [hashedPassword, user.id]
  );

  // Mark token as used in password_reset_tokens
  const nowFormatted = formatMySQLDateTime(new Date());
  await db.query(
    `UPDATE password_reset_tokens SET used_at = ? WHERE id = ?`,
    [nowFormatted, tokenRecord.id]
  );

  return { success: true };
}