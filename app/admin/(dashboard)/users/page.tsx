import UserManager from '@/components/admin/UserManager';

export const metadata = {
  title: 'Customer Management | Admin Portal',
  description: 'View registered customers, monitor order counts and spending, and manage user statuses.',
};

export default function AdminUsersPage() {
  return <UserManager />;
}
