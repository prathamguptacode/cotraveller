import { v2 as cloudinary } from 'cloudinary'
import env from './env'

cloudinary.config({
    api_key: env.CLOUDINARY_CLOUD_API_KEY,
    api_secret: env.CLOUDINARY_CLOUD_API_SECRET,
    cloud_name: env.CLOUDINARY_CLOUD_NAME
})

export default cloudinary