"use client"

import useSWR from "swr"
import { createClient } from "@/lib/supabase/client"
import type { Url } from "@/lib/types"
import { UrlCard } from "@/components/url-card"

const fetcher = async () => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("urls")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10)

  if (error) throw error
  return data as Url[]
}

export function UrlList() {
  const { data: urls, error, mutate } = useSWR("urls", fetcher)

  if (error) {
    return (
      <div className="text-center text-red-400 py-8">
        Failed to load URLs
      </div>
    )
  }

  if (!urls) {
    return (
      <div className="text-center text-gray-400 py-8">
        Loading...
      </div>
    )
  }

  if (urls.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        No URLs yet. Create your first short link above!
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-white mb-4">Recent Links</h2>
      {urls.map((url) => (
        <UrlCard key={url.id} url={url} onDelete={() => mutate()} />
      ))}
    </div>
  )
}
