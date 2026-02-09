const TOKEN_KEY = "discovr_id_token"
const BRAND_TOKEN_KEY = "brand_token"
const BRAND_ROLE_KEY = "brand_role"

let memoryToken: string | null = null
let memoryBrandToken: string | null = null
let memoryBrandRole: string | null = null

export const getCachedIdToken = () => {
  if (typeof window === "undefined") {
    return memoryToken
  }

  const token = window.localStorage.getItem(TOKEN_KEY)
  memoryToken = token
  return token
}

export const setCachedIdToken = (token: string) => {
  memoryToken = token
  if (typeof window !== "undefined") {
    window.localStorage.setItem(TOKEN_KEY, token)
  }
}

export const clearCachedIdToken = () => {
  memoryToken = null
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(TOKEN_KEY)
  }
}

export const getBrandAuthToken = () => {
  if (typeof window === "undefined") {
    return memoryBrandToken
  }
  const token = window.localStorage.getItem(BRAND_TOKEN_KEY)
  memoryBrandToken = token
  return token
}

export const setBrandAuthToken = (token: string, role: "brand_owner" | "brand_emp") => {
  memoryBrandToken = token
  memoryBrandRole = role
  if (typeof window !== "undefined") {
    window.localStorage.setItem(BRAND_TOKEN_KEY, token)
    window.localStorage.setItem(BRAND_ROLE_KEY, role)
  }
}

export const clearBrandTokens = () => {
  memoryBrandToken = null
  memoryBrandRole = null
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(BRAND_TOKEN_KEY)
    window.localStorage.removeItem(BRAND_ROLE_KEY)
  }
}

export const getBrandAuthRole = () => {
  if (typeof window === "undefined") {
    return memoryBrandRole as "brand_owner" | "brand_emp" | null
  }
  const role = window.localStorage.getItem(BRAND_ROLE_KEY)
  memoryBrandRole = role
  return (role as "brand_owner" | "brand_emp" | null) ?? null
}
