import Link from 'next/link';

export default function CartPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Shopping Cart</h1>
      <p className="text-sm text-slate-500 mt-2">Proceed to checkout to finalize your purchase.</p>
      <Link href="/payment" className="inline-block mt-4 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold">
        Proceed to Payment & Checkout
      </Link>
    </div>
  );
}
