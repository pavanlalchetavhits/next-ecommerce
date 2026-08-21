import { getSettings } from '@/services/setting.service';
import SettingsManager from '@/components/admin/SettingsManager';

export const revalidate = 0;

export default async function AdminSettingsPage() {
  const initialSettings = await getSettings();

  return <SettingsManager initialSettings={initialSettings} />;
}
