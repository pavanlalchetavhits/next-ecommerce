import db from '@/lib/db';
import { ProductVarientInput } from '@/lib/validations/product-variant';

export async function getProductVarients(productId:number){
    
    const [rows] = await db.query(`
        select
            id,
            product_id,
            sku,
            varient_name,
            attributes,
            price,
            status,
            created_at,
            updated_at
        from product_variants
        where product_id = ?
        order by created_at asc
        `,[productId])
    return rows;
}

export async function getVarientById(id:number){
    const [rows] = await db.query(`
        select
            id,
            product_id,
            sku,
            variant_name,
            attributes,
            price,
            status,
            created_at,
            updated_at
        from product_variants
        where id = ?
        `,[id])
    return rows;
}

export async function createProductVarient(
    productId: number,
    data: ProductVarientInput
){
    const [result] = await db.query(`
        insert into product_variants(
            product_id,
            sku,
            variant_name,
            attributes,
            price,
            status
        )   values (?,?,?,?,?,?)
        `,[
            productId,
            data.sku,
            data.variant_name,
            JSON.stringify(data.attributes || {}),
            data.price ?? null,
            data.status,
        ])
    return result;
}

export async function updateProductVariant(
    id:number,
    data:ProductVarientInput
){
    const [result] = await db.query(`
        update product_variants
        set
            sku = ?,
            variant_name = ?,
            attributes = ?,
            price = ?,
            status = ?
        where id = ?    
    `,[
        data.sku,
        data.variant_name,
        JSON.stringify(data.attributes || {}),
        data.price,
        data.status,
        id,
    ])

    return result;
}

export async function deleteProdcutVariant(id:number)
{
    const [result] = await db.query(`
        delete from product_variants
        where id = ?
    `,[id])

    return result;
}