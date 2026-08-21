import db from '@/lib/db';
import { ProductInput } from '@/lib/validations/products';
import { syncProductImages } from '@/services/product-image.service';
export async function getProducts() {

    const [rows] = await db.query(`
        select
            p.id,
            p.category_id,
            p.name,
            p.slug,
            p.description,
            p.short_description,
            p.care_instructions,
            p.specifications,
            p.shipping_info,
            p.faq,
            p.sku,
            p.price,
            p.compare_at_price,
            p.status,
            p.featured,
            p.created_at,
            p.updated_at,

            c.name as category_name,
            (
                select pi.image_url
                from product_images pi
                where pi.product_id = p.id
                order by pi.is_primary desc, pi.sort_order asc, pi.id asc
                limit 1
            ) as primary_image
        from products p

        left join categories c
            ON p.category_id = c.id

        ORDER BY p.created_at DESC
        `)
    return rows;
}

export async function getProductById(id:number)
{
    
    const [rows] = await db.query(`
        select
            p.id,
            p.category_id,
            p.name,
            p.slug,
            p.description,
            p.short_description,
            p.care_instructions,
            p.specifications,
            p.shipping_info,
            p.faq,
            p.sku,
            p.price,
            p.compare_at_price,
            p.status,
            p.featured,
            p.created_at,
            p.updated_at,

            c.name as category_name
        from products p

        inner join categories c
            ON p.category_id = c.id

        where p.id = ?

        ORDER BY p.created_at DESC
        `,[id])

    const productsRows = rows as any[];

    if(productsRows.length === 0){
        return null;
    }

    const product = productsRows[0];

    // Safely parse JSON fields if MySQL returns string
    if (typeof product.specifications === 'string') {
        try {
            product.specifications = JSON.parse(product.specifications);
        } catch {
            // Keep original string if HTML content
        }
    }
    if (typeof product.faq === 'string') {
        try {
            product.faq = JSON.parse(product.faq);
        } catch {
            product.faq = [];
        }
    }

    const [images] = await db.query(`
        select
            id,
            image_url,
            alt_text,
            is_primary,
            sort_order
        from product_images
        where product_id = ?
        order by sort_order asc, created_at asc
        `,[id])
    return {
        ...product,
        images,
    };
}

export async function createProduct(data:ProductInput) 
{   
    const specsJson = data.specifications ? JSON.stringify(data.specifications) : null;
    const faqJson = data.faq ? JSON.stringify(data.faq) : null;

    const [result] = await db.query(`
        insert into products(
            category_id,
            name,
            slug,
            description,
            short_description,
            care_instructions,
            specifications,
            shipping_info,
            faq,
            sku,
            price,
            compare_at_price,
            status,
            featured
        ) Values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        `,[ data.category_id,
            data.name,
            data.slug,
            data.description || null,
            data.short_description || null,
            data.care_instructions || null,
            specsJson,
            data.shipping_info || null,
            faqJson,
            data.sku,
            data.price,
            data.compare_at_price ?? null,
            data.status,
            data.featured
        ])

    const insertId = (result as any).insertId;
    if (insertId && data.images && Array.isArray(data.images)) {
        await syncProductImages(insertId, data.images);
    }

    return result;
}

export async function updateProduct(
    id:number,
    data:ProductInput
){
    const specsJson = data.specifications ? JSON.stringify(data.specifications) : null;
    const faqJson = data.faq ? JSON.stringify(data.faq) : null;

    const [result] = await db.query(`
        update products
        SET
            category_id = ?,
            name = ?,
            slug = ?,
            description = ?,
            short_description = ?,
            care_instructions = ?,
            specifications = ?,
            shipping_info = ?,
            faq = ?,
            sku = ?,
            price = ?,
            compare_at_price = ?,
            status = ?,
            featured = ?
        where id = ?
        `,[
            data.category_id,
            data.name,
            data.slug,
            data.description || null,
            data.short_description || null,
            data.care_instructions || null,
            specsJson,
            data.shipping_info || null,
            faqJson,
            data.sku,
            data.price,
            data.compare_at_price ?? null,
            data.status,
            data.featured,
            id  
        ])

    if (data.images && Array.isArray(data.images)) {
        await syncProductImages(id, data.images);
    }

    return result;
}

export async function deleteProduct(id:number){

    const [result] = await db.query(`
        delete from products where id = ?
        `,[id])
    return result;
}