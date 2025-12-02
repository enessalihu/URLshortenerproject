"use client"

import { useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import QRCode from "qrcode"

interface QrCodeModalProps {
  isOpen: boolean
  onClose: () => void
  url: string
  shortCode: string
}

export function QrCodeModal({ isOpen, onClose, url, shortCode }: QrCodeModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 256,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      })
    }
  }, [isOpen, url])

  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement("a")
      link.download = `qr-${shortCode}.png`
      link.href = canvasRef.current.toDataURL("image/png")
      link.click()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#111111] border-[#222222] text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">QR Code</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="bg-white p-4 rounded-lg">
            <canvas ref={canvasRef} />
          </div>
          <p className="text-sm text-gray-400 text-center break-all">{url}</p>
          <Button onClick={handleDownload} className="bg-white text-black hover:bg-gray-200">
            <Download className="mr-2 h-4 w-4" />
            Download QR Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
