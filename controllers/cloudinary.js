import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv"

dotenv.config({
    path:'../.env'
})

cloudinary.config({ 
    cloud_name: 'daolco0ze', 
    api_key: '923574576552995', 
    api_secret:`${process.env.CLOUDINARY_SECRET}`
});

const uploadResult =  async (filepath)=>{
    const data = await cloudinary.uploader
       .upload(
           filepath, 
           {
            resource_type:'raw'
           }
       )
       .catch((error) => {
           console.log(error);
       });
    
    return data;
    }
export {uploadResult}
