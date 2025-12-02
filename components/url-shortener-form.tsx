"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createShortUrl } from "@/app/actions"
import { mutate } from "swr"
import { Link2 } from "lucide-react"

export function UrlShortenerForm() {
  const [url, setUrl] = useState("")
  const [expiresIn, setExpiresIn] = useState("24")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await createShortUrl({
        originalUrl: url,
        expiresIn: Number.parseInt(expiresIn),
      })

      if (result.error) {
        setError(result.error)
      } else {
        setUrl("")
        // Refresh the URL list
        mutate("urls")
      }
    } catch {
      setError("Failed to create short URL")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-[#111111] border border-[#222222] rounded-lg p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url" className="text-gray-300">
              Enter your long URL
            </Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com/very-long-url-that-needs-shortening"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="bg-[#0a0a0a] border-[#333333] text-white placeholder:text-gray-500 h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expires" className="text-gray-300">
              Link expires in
            </Label>
            <Select value={expiresIn} onValueChange={setExpiresIn}>
              <SelectTrigger className="bg-[#0a0a0a] border-[#333333] text-white h-12">
                <SelectValue placeholder="Select expiration time" />
              </SelectTrigger>
              <SelectContent className="bg-[#111111] border-[#333333]">
                <SelectItem value="1">1 hour</SelectItem>
                <SelectItem value="6">6 hours</SelectItem>
                <SelectItem value="12">12 hours</SelectItem>
                <SelectItem value="24">24 hours (default)</SelectItem>
                <SelectItem value="48">48 hours</SelectItem>
                <SelectItem value="168">1 week</SelectItem>
                <SelectItem value="720">30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-white text-black hover:bg-gray-200 font-medium"
          >
            {isLoading ? (
              "Shortening..."
            ) : (
              <>
                <Link2 className="mr-2 h-4 w-4" />
                Shorten URL
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}
