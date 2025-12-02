"use client"

import useSWR from "swr"
import { createClient } from "@/lib/supabase/client"
import { UrlCard } from "@/components/url-card"
import type { Url } from "@/lib/types"

const fetcher = async () => {
  const supabase = createClient()
  const { data, error } = await supabase.from("urls").select("*").order("created_at", { ascending: false })

  if (error) throw error
  return data as Url[]
}

export function UrlList() {
  const { data: urls, error, isLoading, mutate } = useSWR("urls", fetcher)

  if (isLoading) {
    return <div className="text-center py-8 text-gray-400">Loading your links...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-400">Failed to load URLs. Please try again.</div>
  }

  if (!urls || urls.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-lg">No shortened URLs yet</p>
        <p className="text-sm mt-2">Create your first short link above!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white mb-4">Your Links</h2>
      {urls.map((url) => (
        <UrlCard key={url.id} url={url} onDelete={() => mutate()} />
      ))}
    </div>
  )
}
