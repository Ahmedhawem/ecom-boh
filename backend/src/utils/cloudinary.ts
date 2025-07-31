import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Upload image to Cloudinary
export const uploadToCloudinary = async (imageData: string): Promise<any> => {
  try {
    // If imageData is a base64 string, upload it directly
    if (imageData.startsWith('data:image')) {
      const result = await cloudinary.uploader.upload(imageData, {
        folder: 'ecom-boh',
        resource_type: 'image',
        transformation: [
          { width: 800, height: 600, crop: 'limit' },
          { quality: 'auto' }
        ]
      })
      return result
    }

    // If imageData is a URL, upload from URL
    if (imageData.startsWith('http')) {
      const result = await cloudinary.uploader.upload(imageData, {
        folder: 'ecom-boh',
        resource_type: 'image',
        transformation: [
          { width: 800, height: 600, crop: 'limit' },
          { quality: 'auto' }
        ]
      })
      return result
    }

    throw new Error('Invalid image data format')
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error)
    throw new Error('Failed to upload image')
  }
}

// Delete image from Cloudinary
export const deleteFromCloudinary = async (publicId: string): Promise<any> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error)
    throw new Error('Failed to delete image')
  }
}

// Generate Cloudinary URL with transformations
export const getCloudinaryUrl = (publicId: string, transformations: any = {}): string => {
  return cloudinary.url(publicId, {
    transformation: [
      { width: 400, height: 300, crop: 'fill' },
      { quality: 'auto' },
      ...transformations
    ]
  })
}

// Generate thumbnail URL
export const getThumbnailUrl = (publicId: string): string => {
  return cloudinary.url(publicId, {
    transformation: [
      { width: 150, height: 150, crop: 'fill' },
      { quality: 'auto' }
    ]
  })
} 