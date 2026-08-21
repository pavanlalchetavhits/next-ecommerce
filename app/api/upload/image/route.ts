import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(request:Request){
    try{
        const formData = await request.formData();
        const file = formData.get('file');

        if(!(file instanceof File))
        {
            return NextResponse.json(
                {
                    success:false,
                    message:'Image file is required'
                },{
                    status:400
                }
            )
        }

        const isImageMime = file.type ? file.type.toLowerCase().startsWith("image/") : false;
        const isImageExtension = /\.(jpg|jpeg|png|webp|gif|svg|avif|bmp|ico)$/i.test(file.name);

        if (!isImageMime && !isImageExtension)
        {
            return NextResponse.json(
                {
                    success:false,
                    message:'Only image files are allowed'
                },{
                    status:400
                }
            )
        }


        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await new Promise<any>((resolve,reject)=>{
            cloudinary.uploader
                .upload_stream(
                    {
                        folder:'next-ecommerce/products',
                        resource_type:'image'
                    },
                    (error,result) => {
                        if(error)
                        {
                            reject(error);
                        }
                        else{
                            resolve(result)
                        }
                    }
                )
            .end(buffer)
        })

        return NextResponse.json({
            success:true,
            message:'Image uploaded Successfully',
            data:{
                url:result.secure_url,
                public_id:result.public_id,
            }
        })
    }
    catch(error)
    {
        console.error('Image upload error:',error);

        return NextResponse.json(
            {
                success:false,
                message:'Image upload failed'
            },{
                status:500
            }
        )
    }
}