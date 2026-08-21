import db from '@/lib/db';

export async function getCategories() {

    const [rows] = await db.query(`
        select
            id,
            name,
            slug,
            description,
            image,
            status,
            sort_order,
            created_at,
            updated_at
        from categories
        ORDER BY sort_order ASC,created_at DESC
        `)
    return rows;
}

export async function getCategoriesById(id:number){
     
    const [rows] = await db.query(`
        select
            id,
            name,
            slug,
            description,
            image,
            status,
            sort_order,
            created_at,
            updated_at
        FROM categories
        where id = ?
        `,[id]);
    return rows;
}

export async function createCategory(data:{
    name:string,
    slug:string,
    description?:string,
    image?:string,
    status?:'active' | 'inactive';
    sort_order?: number;
}){
    const [result] = await db.query(`
        insert into categories
            (name,slug,description,image,status,sort_order)
        VALUES
            (?,?,?,?,?,?)
        `,[data.name,data.slug,data.description || null,data.image || null,data.status || 'active',data.sort_order || 0]);

        return result;
}

export async function updateCategory(
    id:number,
    data:{
        name:string;
        slug:string;
        description?:string;
        image?:string;
        status?: 'active' | 'inactive';
        sort_order?: number;
    }
){
    const [result] = await db.query(`
        update categories
        SET
            name=?,
            slug=?,
            description=?,
            image=?,
            status=?,
            sort_order=?
        where id = ?
        `,[data.name,data.slug,data.description || null,data.image || null,data.status || 'active',data.sort_order || 0,id])
    return result;
}

export async function deleteCategory(id:number){
    const [result] = await db.query(`delete from categories where id=?`,[id])
    return result;
}