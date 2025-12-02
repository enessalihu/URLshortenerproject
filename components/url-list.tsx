"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Trash2, ExternalLink, QrCode, Check } from "lucide-react"
import type { Url } from "@/lib/types"
import { deleteShortUrl } from "@/app/actions"
import { QrCodeModal } from "@/components/qr-code-modal"

interface UrlCardProps {
  url: Url
  onDelete: () => void
}

const SHORT_DOMAIN =
  process.env.NEXT_PUBLIC_SHORT_DOMAIN ||
  (typeof window !== "undefined" ? window.location.origin : "https://short.link")

export function UrlCard({ url, onDelete }: UrlCardProps) {
  const [copied, setCopied] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showQrModal, setShowQrModal] = useState(false)

  const shortUrl = `${SHORT_DOMAIN}/r/${url.short_code}`
  // Display URL (cleaner format for display)
  const displayUrl = `https://short.link/${url.short_code}`

  const handleCopy = async () => {
    // Copy the actual working URL
    await navigator.clipboard.writeText(shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteShortUrl(url.id)
      onDelete()
    } catch {
      console.error("Failed to delete URL")
    } finally {
      setIsDeleting(false)
    }
  }

  const isExpired = url.expires_at && new Date(url.expires_at) < new Date()

  const formatExpiration = (expiresAt: string | null) => {
    if (!expiresAt) return "Never"
    const date = new Date(expiresAt)
    const now = new Date()
    if (date < now) return "Expired"

    const diff = date.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} left`
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} left`
    return "Less than an hour"
  }

  return (
    <>
      <div className={`bg-[#111111] border border-[#222222] rounded-lg p-5 ${isExpired ? "opacity-60" : ""}`}>
        <div className="flex flex-col gap-3">
          {/* Short URL - Shows display URL but links to actual working URL */}
          <div className="flex items-center justify-between">
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-2 truncate"
            >
              {displayUrl}
              <ExternalLink className="h-4 w-4 flex-shrink-0" />
            </a>
            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowQrModal(true)}
                className="text-gray-400 hover:text-white hover:bg-[#222222] h-8 w-8"
                title="Show QR Code"
              >
                <QrCode className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className="text-gray-400 hover:text-white hover:bg-[#222222] h-8 w-8"
              >
                {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-gray-400 hover:text-red-400 hover:bg-[#222222] h-8 w-8"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Original URL */}
          <p className="text-gray-500 text-sm truncate" title={url.original_url}>
            {url.original_url}
          </p>

          {/* Stats and expiration - Ensured exact styling per PDF: 14px font, #9bb7f4 color */}
          <div className="flex items-center justify-between">
            <span style={{ fontSize: "14px", color: "#9bb7f4" }}>
              This link has been clicked {url.click_count} time{url.click_count !== 1 ? "s" : ""}.
            </span>
            <span className={`text-xs ${isExpired ? "text-red-400" : "text-gray-500"}`}>
              {formatExpiration(url.expires_at)}
            </span>
          </div>
        </div>
      </div>

      <QrCodeModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        url={shortUrl}
        shortCode={url.short_code}
      />
    </>
  )
}
