import { getPayment } from '@/services/payment.service';
import PaymentManager from '@/components/admin/PaymentManager';

export const dynamic = 'force-dynamic';

export default async function AdminPaymentsPage() {
  let payments: any[] = [];
  try {
    const rows = await getPayment({});
    payments = Array.isArray(rows) ? rows : [];
  } catch (error) {
    console.error('Failed to fetch payments for admin dashboard:', error);
  }

  return <PaymentManager payments={payments} />;
}
