import { getAllInventory } from '@/services/inventory.service';
import InventoryManager, {
  InventoryItem,
} from '@/components/admin/InventoryManager';

export const revalidate = 0;

export default async function AdminInventoryPage() {
  const inventoryRaw: any = await getAllInventory();

  const inventory: InventoryItem[] = (inventoryRaw || []).map((item: any) => ({
    product_id: Number(item.product_id),
    product_name: item.product_name,
    product_sku: item.product_sku,
    product_price: Number(item.product_price),
    product_status: item.product_status || 'active',
    category_name: item.category_name || null,
    primary_image: item.primary_image || null,

    inventory_id: item.inventory_id ? Number(item.inventory_id) : null,
    variant_id: item.variant_id ? Number(item.variant_id) : null,
    variant_name: item.variant_name || null,
    variant_sku: item.variant_sku || null,

    quantity: Number(item.quantity || 0),
    reserved_quantity: Number(item.reserved_quantity || 0),
    low_stock_threshold: Number(item.low_stock_threshold || 5),
    updated_at: item.updated_at ? new Date(item.updated_at).toISOString() : null,
  }));

  return <InventoryManager inventory={inventory} />;
}
