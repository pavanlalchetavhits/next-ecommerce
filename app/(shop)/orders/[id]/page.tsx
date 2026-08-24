export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Order Details #{id}</h1>
    </div>
  );
}
