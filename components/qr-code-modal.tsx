// src/components/qr-code-modal.tsx

"use client";

import { useRef } from "react";
import dynamic from 'next/dynamic'; 
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";


const DynamicQRCodeCanvas = dynamic(
  () => import('./QRCodeCanvas'), // this should import the default export
  { 
    ssr: false, 
    loading: () => <div className="bg-white p-4 rounded-lg w-64 h-64 flex items-center justify-center">Loading QR...</div>
  }
);

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  shortCode: string;
}

export function QrCodeModal({ isOpen, onClose, url, shortCode }: QrCodeModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null); 

  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement("a");
      link.download = `qr-${shortCode}.png`;
      link.href = canvasRef.current.toDataURL("image/png");
      link.click();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#111111] border-[#222222] text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">QR Code</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          
          {/*  DYNAMIC COMPONENT is here */}
          {isOpen && url && (
            <DynamicQRCodeCanvas 
              link={url} 
              canvasRef={canvasRef} 
            />
          )}

          <p className="text-sm text-gray-400 text-center break-all">{url}</p>
          <Button onClick={handleDownload} className="bg-white text-black hover:bg-gray-200">
            <Download className="mr-2 h-4 w-4" />
            Download QR Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
