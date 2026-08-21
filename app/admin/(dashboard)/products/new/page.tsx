import ProductForm from '@/components/admin/ProductForm';
import { getCategories } from '@/services/category.service';

export const revalidate = 0;

export default async function NewProductPage() {
  const categoriesRaw: any = await getCategories();

  const categories = categoriesRaw.map((cat: any) => ({
    id: Number(cat.id),
    name: cat.name,
  }));

  return <ProductForm categories={categories} />;
}
