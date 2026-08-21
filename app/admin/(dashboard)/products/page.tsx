import { getProducts } from '@/services/product.service';
import ProductManager, { ProductItem } from '@/components/admin/ProductManager';

export const revalidate = 0;

export default async function ProductsPage() {
  const productsRaw: any = await getProducts();

  const products: ProductItem[] = productsRaw.map((prod: any) => ({
    id: Number(prod.id),
    category_id: Number(prod.category_id),
    category_name: prod.category_name,
    name: prod.name,
    slug: prod.slug,
    description: prod.description || null,
    sku: prod.sku,
    price: Number(prod.price),
    compare_at_price: prod.compare_at_price ? Number(prod.compare_at_price) : null,
    primary_image: prod.primary_image || null,
    status: prod.status || 'active',
    featured: Boolean(prod.featured),
    created_at: new Date(prod.created_at).toISOString(),
  }));

  return <ProductManager products={products} />;
}
