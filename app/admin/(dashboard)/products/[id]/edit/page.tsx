import ProductForm from '@/components/admin/ProductForm';
import { getProductById } from '@/services/product.service';
import { getCategories } from '@/services/category.service';
import { notFound } from 'next/navigation';

export const revalidate = 0;

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage({ params }: Params) {
  const { id } = await params;
  const productId = Number(id);

  if (!Number.isInteger(productId)) {
    notFound();
  }

  const [productRaw, categoriesRaw]: any[] = await Promise.all([
    getProductById(productId),
    getCategories(),
  ]);

  if (!productRaw) {
    notFound();
  }

  const categories = categoriesRaw.map((cat: any) => ({
    id: Number(cat.id),
    name: cat.name,
  }));

  const initialImages = (productRaw.images || []).map((img: any) => ({
    id: Number(img.id),
    image_url: img.image_url,
    is_primary: Boolean(img.is_primary),
    alt_text: img.alt_text || '',
  }));

  const initialData = {
    id: Number(productRaw.id),
    category_id: Number(productRaw.category_id),
    name: productRaw.name,
    slug: productRaw.slug,
    short_description: productRaw.short_description || '',
    description: productRaw.description || '',
    care_instructions: productRaw.care_instructions || '',
    specifications: productRaw.specifications || '',
    shipping_info: productRaw.shipping_info || '',
    faq: Array.isArray(productRaw.faq) ? productRaw.faq : [],
    sku: productRaw.sku,
    price: Number(productRaw.price),
    compare_at_price: productRaw.compare_at_price
      ? Number(productRaw.compare_at_price)
      : null,
    status: productRaw.status || 'active',
    featured: Boolean(productRaw.featured),
    images: initialImages,
  };

  return <ProductForm categories={categories} initialData={initialData} />;
}
