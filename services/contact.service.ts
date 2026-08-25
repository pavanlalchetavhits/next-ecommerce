import db from '@/lib/db';

export interface ContactMessageInput {
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
}

export type ContactMessageStatus = 'unread' | 'read' | 'replied' | 'archived';

let tableChecked = false;

export async function ensureContactTableExists() {
  if (tableChecked) return;
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NULL,
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        status ENUM('unread', 'read', 'replied', 'archived') NOT NULL DEFAULT 'unread',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_contact_messages_status (status),
        INDEX idx_contact_messages_created_at (created_at)
      ) ENGINE=InnoDB;
    `);
    tableChecked = true;
  } catch (err) {
    console.error('Failed to ensure contact_messages table:', err);
  }
}

export async function createContactMessage(data: ContactMessageInput) {
  await ensureContactTableExists();

  const [result]: any = await db.query(
    `
      INSERT INTO contact_messages (name, email, phone, subject, message, status)
      VALUES (?, ?, ?, ?, ?, 'unread')
    `,
    [
      data.name.trim(),
      data.email.trim(),
      data.phone ? data.phone.trim() : null,
      data.subject.trim(),
      data.message.trim(),
    ]
  );

  return { id: result.insertId, ...data, status: 'unread' };
}

export async function getContactMessages(filters?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  await ensureContactTableExists();

  const page = Math.max(1, filters?.page || 1);
  const limit = Math.max(1, Math.min(100, filters?.limit || 20));
  const offset = (page - 1) * limit;

  let whereClauses: string[] = [];
  let params: any[] = [];

  if (filters?.status && filters.status !== 'all') {
    whereClauses.push('status = ?');
    params.push(filters.status);
  }

  if (filters?.search && filters.search.trim()) {
    const q = `%${filters.search.trim()}%`;
    whereClauses.push('(name LIKE ? OR email LIKE ? OR subject LIKE ?)');
    params.push(q, q, q);
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  // Get total count
  const [countRows]: any = await db.query(
    `SELECT COUNT(*) as total FROM contact_messages ${whereSql}`,
    params
  );
  const total = countRows[0]?.total || 0;

  // Get items
  const [rows]: any = await db.query(
    `
      SELECT id, name, email, phone, subject, message, status, created_at, updated_at
      FROM contact_messages
      ${whereSql}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `,
    [...params, limit, offset]
  );

  // Get stats summary (unread, replied, total)
  const [statsRows]: any = await db.query(`
    SELECT 
      COUNT(*) as total_count,
      SUM(CASE WHEN status = 'unread' THEN 1 ELSE 0 END) as unread_count,
      SUM(CASE WHEN status = 'replied' THEN 1 ELSE 0 END) as replied_count,
      SUM(CASE WHEN status = 'read' THEN 1 ELSE 0 END) as read_count
    FROM contact_messages
  `);

  const stats = {
    total: statsRows[0]?.total_count || 0,
    unread: statsRows[0]?.unread_count || 0,
    replied: statsRows[0]?.replied_count || 0,
    read: statsRows[0]?.read_count || 0,
  };

  return {
    messages: rows,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    stats,
  };
}

export async function updateContactMessageStatus(
  id: number,
  status: ContactMessageStatus
) {
  await ensureContactTableExists();

  const [result]: any = await db.query(
    `UPDATE contact_messages SET status = ? WHERE id = ?`,
    [status, id]
  );

  return result.affectedRows > 0;
}

export async function deleteContactMessage(id: number) {
  await ensureContactTableExists();

  const [result]: any = await db.query(
    `DELETE FROM contact_messages WHERE id = ?`,
    [id]
  );

  return result.affectedRows > 0;
}
