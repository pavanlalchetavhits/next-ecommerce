import db from '@/lib/db';

export async function getProductInventroy(productId:number)
{
    const [rows] = await db.query(`
        select
            i.id,
            i.product_id,
            i.varient_id,
            i.quantity,
            i.reserved_quantity,
            i.low_stock_threshold

            pv.variant_name,
            pv.sku as variant_sku
        
        from inventory i

        left join product_variants pv
            On i.varient_id = pv.id
        
        where i.product_id = ?

        order by i.id asc
    `,[productId])

    return rows;
}

export async function createInventory(data:{
    product_id:number;
    variant_id?:number | null;
    quantity?:number;
    reserved_quantity?:number;
    low_stock_threshold?:number;    
})
{
    const [result] = await db.query(`
        insert into inventory(
            product_id,
            variant_id,
            quantity,
            reserved_quantity,
            low_stock_threshold
        ) values (?,?,?,?,?)
    `,[
        data.product_id,
        data.variant_id ?? null,
        data.quantity ?? 0,
        data.reserved_quantity ?? 0,
        data.low_stock_threshold ?? 5,
    ])

    return result;
}

export async function updateInventory(
    id:number,
    data:{
        quantity:number;
        reserved_quantity:number;
        low_stock_thresold:number;
    }
)
{
    const [result] = await db.query(`
        update inventory
        set
            quantity = ?,
            reserved_quantity = ?,
            low_stock_threshold = ?
        where id = ?
    `,[
        data.quantity,
        data.reserved_quantity,
        data.low_stock_thresold,
        id
    ])

    return result;
}   