import db from '@/lib/db';

export interface DashboardStats {
  productsCount: number;
  categoriesCount: number;
  usersCount: number;
  ordersCount: number;
  totalRevenue: number;
  recentOrders: Array<{
    id: string | number;
    order_number?: string;
    customer: string;
    email: string;
    amount: string;
    status: string;
    date: string;
  }>;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const [productRows]: any = await db.query(
      'SELECT COUNT(*) as total FROM products'
    );
    const [categoryRows]: any = await db.query(
      'SELECT COUNT(*) as total FROM categories'
    );
    const [userRows]: any = await db.query(
      'SELECT COUNT(*) as total FROM users WHERE role = "user"'
    );

    let totalOrders = 0;
    let totalRevenue = 0;
    let recentOrders: any[] = [];

    try {
      const [orderRows]: any = await db.query(
        'SELECT COUNT(*) as total, COALESCE(SUM(total_amount), 0) as revenue FROM orders'
      );
      totalOrders = orderRows[0]?.total || 0;
      totalRevenue = orderRows[0]?.revenue || 0;

      const [recentRows]: any = await db.query(`
        SELECT 
          o.id, 
          COALESCE(o.order_number, CONCAT('#ORD-', o.id)) as order_number, 
          o.total_amount, 
          o.status, 
          o.created_at, 
          COALESCE(u.name, 'Guest Customer') as customer, 
          COALESCE(u.email, 'N/A') as email
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
        LIMIT 5
      `);

      recentOrders = (recentRows as any[]).map((r) => ({
        id: r.order_number || `#ORD-${r.id}`,
        customer: r.customer,
        email: r.email,
        amount: `$${Number(r.total_amount || 0).toFixed(2)}`,
        status:
          r.status.charAt(0).toUpperCase() + r.status.slice(1).toLowerCase(),
        date: new Date(r.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      }));
    } catch {
      // Orders table might not exist yet; fallback safely
    }

    return {
      productsCount: Number(productRows[0]?.total || 0),
      categoriesCount: Number(categoryRows[0]?.total || 0),
      usersCount: Number(userRows[0]?.total || 0),
      ordersCount: Number(totalOrders),
      totalRevenue: Number(totalRevenue),
      recentOrders,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats from MySQL:', error);
    return {
      productsCount: 0,
      categoriesCount: 0,
      usersCount: 0,
      ordersCount: 0,
      totalRevenue: 0,
      recentOrders: [],
    };
  }
}
