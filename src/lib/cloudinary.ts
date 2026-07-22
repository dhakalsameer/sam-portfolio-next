import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadImage(
  base64Image: string,
  folder: string = "portfolio"
) {
  const result = await cloudinary.uploader.upload(base64Image, {
    folder,
  })
  return { url: result.secure_url, publicId: result.public_id }
}

export async function deleteImage(publicId: string) {
  await cloudinary.uploader.destroy(publicId)
}

export function cl(url: string, width: number, aspectRatio?: string) {
  return url.replace(
    "/image/upload/",
    `/image/upload/f_auto,q_auto,w_${width}${aspectRatio ? `,ar_${aspectRatio},c_fill` : ",c_fill"}/`
  )
}

export { cloudinary }
