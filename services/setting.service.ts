import db from '@/lib/db';

export async function getSettings(): Promise<Record<string, string>> {
  try {
    const [rows]: any = await db.query(`
      SELECT setting_key, setting_value
      FROM settings
    `);

    const settingsObj: Record<string, string> = {};

    if (Array.isArray(rows)) {
      for (const row of rows) {
        settingsObj[row.setting_key] = row.setting_value ?? '';
      }
    }

    return settingsObj;
  } catch (error) {
    console.error('getSettings error:', error);
    return {};
  }
}

export async function updateSettings(settings: Record<string, any>) {
  const entries = Object.entries(settings);

  for (const [key, val] of entries) {
    const valueStr =
      val === null || val === undefined
        ? null
        : typeof val === 'object'
        ? JSON.stringify(val)
        : String(val);

    await db.query(
      `
      INSERT INTO settings (setting_key, setting_value)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)
    `,
      [key, valueStr]
    );
  }

  return true;
}
