const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "daqpb7odj"
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "adora_upload"

export const uploadToCloudinary = async (file: File): Promise<string> => {
  try {
    const formData = new FormData()
    formData.append("avatar", file)

    const response = await fetch("http://localhost:5000/api/profile/upload-avatar", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("[v0] Backend upload error details:", errorData)
      throw new Error(`Backend upload failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.profile?.avatar || ""
  } catch (error) {
    console.error("[v0] Avatar upload error:", error)
    throw error
  }
}
