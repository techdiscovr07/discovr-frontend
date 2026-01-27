const TOKEN_KEY = "discovr_id_token"

let memoryToken: string | null = null

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
