"use server"

import { createClient } from "@/lib/supabase/server"
import { generateShortCode } from "@/lib/utils/generate-short-code"
import type { CreateUrlRequest } from "@/lib/types"

export async function createShortUrl(request: CreateUrlRequest) {
  const supabase = await createClient()

  // Validate URL
  try {
    new URL(request.originalUrl)
  } catch {
    return { error: "Invalid URL format" }
  }

  // Generate unique short code
  let shortCode = generateShortCode()
  let attempts = 0
  const maxAttempts = 5

  // Ensure uniqueness
  while (attempts < maxAttempts) {
    const { data: existing } = await supabase.from("urls").select("id").eq("short_code", shortCode).maybeSingle()

    if (!existing) break
    shortCode = generateShortCode()
    attempts++
  }

  // Calculate expiration time
  const expiresIn = request.expiresIn || 24 // default 24 hours
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + expiresIn)

  const { data, error } = await supabase
    .from("urls")
    .insert({
      original_url: request.originalUrl,
      short_code: shortCode,
      expires_at: expiresAt.toISOString(),
      click_count: 0,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating short URL:", error)
    return { error: "Failed to create short URL" }
  }

  return { data }
}

export async function deleteShortUrl(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("urls").delete().eq("id", id)

  if (error) {
    console.error("Error deleting URL:", error)
    return { error: "Failed to delete URL" }
  }

  return { success: true }
}

export async function getUrlByShortCode(shortCode: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("urls").select("*").eq("short_code", shortCode).single()

  if (error || !data) {
    return { error: "URL not found" }
  }

  // Check if expired
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return { error: "This link has expired" }
  }

  // Increment click count
  await supabase
    .from("urls")
    .update({ click_count: data.click_count + 1 })
    .eq("id", data.id)

  return { data }
}
