export interface ProfileFormData {
  name: string
  phone: string
  country: string
  bio: string
  avatar?: File
}

export interface BusinessFormData {
  name: string
  description: string
  country: string
}

export const validateProfileForm = (data: ProfileFormData): Record<string, string> => {
  const errors: Record<string, string> = {}

  if (!data.name || data.name.trim().length === 0) {
    errors.name = "Full name is required"
  } else if (data.name.trim().length < 2) {
    errors.name = "Full name must be at least 2 characters"
  }

  if (!data.phone || data.phone.trim().length === 0) {
    errors.phone = "Phone number is required"
  } else if (!/^\+?[0-9\s\-()]{10,}$/.test(data.phone.replace(/\s/g, ""))) {
    errors.phone = "Please enter a valid phone number"
  }

  if (!data.country || data.country.trim().length === 0) {
    errors.country = "Country is required"
  }

  if (!data.bio || data.bio.trim().length === 0) {
    errors.bio = "Bio is required"
  } else if (data.bio.trim().length < 10) {
    errors.bio = "Bio must be at least 10 characters"
  } else if (data.bio.trim().length > 500) {
    errors.bio = "Bio must not exceed 500 characters"
  }

  if (!data.avatar) {
    errors.avatar = "Avatar is required"
  }

  return errors
}

export const validateBusinessForm = (data: BusinessFormData): Record<string, string> => {
  const errors: Record<string, string> = {}

  if (!data.name || data.name.trim().length === 0) {
    errors.name = "Business name is required"
  } else if (data.name.trim().length < 2) {
    errors.name = "Business name must be at least 2 characters"
  }

  if (!data.description || data.description.trim().length === 0) {
    errors.description = "Business description is required"
  } else if (data.description.trim().length < 10) {
    errors.description = "Business description must be at least 10 characters"
  } else if (data.description.trim().length > 500) {
    errors.description = "Business description must not exceed 500 characters"
  }

  if (!data.country || data.country.trim().length === 0) {
    errors.country = "Country is required"
  }

  return errors
}
