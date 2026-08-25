import db from '@/lib/db';

export interface AddressInput {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string | null;
  city: string;
  state: string;
  postal_code: string;
  country?: string;
  address_type?: 'home' | 'work' | 'other';
  is_default?: boolean;
}

export async function ensureAddressTableExists() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS addresses (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      user_id BIGINT UNSIGNED NOT NULL,
      full_name VARCHAR(150) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      address_line1 VARCHAR(255) NOT NULL,
      address_line2 VARCHAR(255) NULL,
      city VARCHAR(100) NOT NULL,
      state VARCHAR(100) NOT NULL,
      postal_code VARCHAR(20) NOT NULL,
      country VARCHAR(100) NOT NULL DEFAULT 'India',
      address_type ENUM('home', 'work', 'other') NOT NULL DEFAULT 'home',
      is_default BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
}

export async function getUserAddresses(userId: number) {
  await ensureAddressTableExists();
  const [rows] = await db.query(
    `SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC`,
    [userId]
  );
  return rows;
}

export async function createUserAddress(userId: number, data: AddressInput) {
  await ensureAddressTableExists();

  if (data.is_default) {
    await db.query(`UPDATE addresses SET is_default = FALSE WHERE user_id = ?`, [userId]);
  }

  const [result]: any = await db.query(
    `INSERT INTO addresses
      (user_id, full_name, phone, address_line1, address_line2, city, state, postal_code, country, address_type, is_default)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      data.full_name,
      data.phone,
      data.address_line1,
      data.address_line2 || null,
      data.city,
      data.state,
      data.postal_code,
      data.country || 'India',
      data.address_type || 'home',
      data.is_default ? 1 : 0,
    ]
  );

  return result.insertId;
}

export async function updateUserAddress(id: number, userId: number, data: AddressInput) {
  await ensureAddressTableExists();

  if (data.is_default) {
    await db.query(`UPDATE addresses SET is_default = FALSE WHERE user_id = ?`, [userId]);
  }

  const [result]: any = await db.query(
    `UPDATE addresses SET
      full_name = ?,
      phone = ?,
      address_line1 = ?,
      address_line2 = ?,
      city = ?,
      state = ?,
      postal_code = ?,
      country = ?,
      address_type = ?,
      is_default = ?
     WHERE id = ? AND user_id = ?`,
    [
      data.full_name,
      data.phone,
      data.address_line1,
      data.address_line2 || null,
      data.city,
      data.state,
      data.postal_code,
      data.country || 'India',
      data.address_type || 'home',
      data.is_default ? 1 : 0,
      id,
      userId,
    ]
  );

  return result.affectedRows > 0;
}

export async function deleteUserAddress(id: number, userId: number) {
  await ensureAddressTableExists();
  const [result]: any = await db.query(
    `DELETE FROM addresses WHERE id = ? AND user_id = ?`,
    [id, userId]
  );
  return result.affectedRows > 0;
}
