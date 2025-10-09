import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export interface optionsProps{
    projectId?: string;
    userId?: string;
}
const uploadOnCloudinary = async (localFilePath:string, options:optionsProps={}) => {
  const { projectId, userId } = options
  try {
    if (!localFilePath) return null

    const uniqueSuffix = `${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 8)}`

    let publicId
    switch (options) {
      case projectId:
        if (!projectId)
          throw new Error("A ProjectId is required for Project's Images.")
        publicId = `project/${projectId}-${uniqueSuffix}`
        break

      case userId:
        if (!userId)
          throw new Error(
            "A UserId is required for User Profile."
          )
        publicId = `user/${userId}-${uniqueSuffix}`
        break
      default:
        throw new Error("Invalid image folder type specified.")
    }
    // const publicId = `${}/${filename}`

    const response = await cloudinary.uploader.upload(localFilePath, {
      public_id: publicId,
      resource_type: "auto",
    })
    fs.unlinkSync(localFilePath)
    // console.log("File uploaded over Cloudinary: ", response.url);
    console.log(response)
    return response
  } catch (error) {
    if (fs.existsSync(localFilePath)) {
      // Check if file still exists before trying to delete
      fs.unlinkSync(localFilePath)
    }
    console.log("Catch u-block of Cloudinary: ", error)
    return null
  }
}

const deleteFromCloudinary = async (imageUrl:string) => {
  try {
      if (!imageUrl || imageUrl.length == 0) return null
      
    const publicId = imageUrl.split("/").pop()?.split(".")[0] ?? ""

    if (!publicId) return null

    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    })
    console.log("File deleted from Cloudinary ")
    console.log(response)

    return response
  } catch (error) {
    console.log("Catch d-block of Cloudinary: ", error)
    return null
  }
}

export { uploadOnCloudinary, deleteFromCloudinary }

// cloudinary.v2.uploader
//   .upload("dog.mp4", {
//     resource_type: "video",
//     public_id: "my_dog",
//     overwrite: true,
//     notification_url: "https://mysite.example.com/notify_endpoint",
//   })
//   .then((result) => console.log(result));
