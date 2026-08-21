import { getCategories } from '@/services/category.service';
import CategoryManager, { Category } from '@/components/admin/CategoryManager';

export const revalidate = 0;

export default async function CategoriesPage() {
  const categoriesRaw: any = await getCategories();

  const categories: Category[] = categoriesRaw.map((cat: any) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description || null,
    image: cat.image || null,
    status: cat.status || 'active',
    sort_order: cat.sort_order || 0,
    created_at: new Date(cat.created_at).toISOString(),
  }));

  return <CategoryManager categories={categories} />;
}
