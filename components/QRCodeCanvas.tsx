

"use client";

import React, { useEffect } from 'react';
import QRCode from 'qrcode';

interface QRCodeCanvasProps {
    link: string;
    canvasRef: React.RefObject<HTMLCanvasElement>; 
}

const QRCodeCanvas: React.FC<QRCodeCanvasProps> = ({ link, canvasRef }) => {

    useEffect(() => {
        if (canvasRef.current && link) {
            console.log("QRCodeCanvas: Drawing canvas for:", link);

            const timer = setTimeout(() => {
                QRCode.toCanvas(canvasRef.current!, link, {
                    width: 256,
                    margin: 2,
                    color: {
                        dark: "#000000",
                        light: "#ffffff",
                    },
                }, (error) => {
                    if (error) {
                        console.error("QRCodeCanvas: QR Code rendering error:", error);
                    }
                });
            }, 50);

            return () => clearTimeout(timer);
        }
    }, [link, canvasRef]);

    return (
        <div className="bg-white p-4 rounded-lg">
            {/*  QR code to be drawn into */}
            <canvas ref={canvasRef} />
        </div>
    );
};


export default QRCodeCanvas;
