export interface Url {
  id: string
  original_url: string
  short_code: string
  click_count: number
  expires_at: string | null
  created_at: string
}

export interface CreateUrlRequest {
  originalUrl: string
  expiresIn?: number // hours until expiration, default 24 hours
}
