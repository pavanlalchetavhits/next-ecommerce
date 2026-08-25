import MessageManager from '@/components/admin/MessageManager';

export const metadata = {
  title: 'Contact Messages | Admin Dashboard',
  description: 'Manage customer contact form submissions and inquiries.',
};

export default function MessagesPage() {
  return <MessageManager />;
}
