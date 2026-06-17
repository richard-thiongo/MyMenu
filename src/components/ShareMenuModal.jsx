"use client";

import { useEffect, useState, useRef } from "react";
import { FiX, FiShare2, FiCopy, FiCheck, FiDownload } from "react-icons/fi";
import { QRCodeCanvas } from "qrcode.react";

export default function ShareMenuModal({ isOpen, onClose, restaurantName }) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const qrRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined" && restaurantName) {
      setUrl(`${window.location.origin}/${encodeURIComponent(restaurantName)}`);
    }
  }, [restaurantName]);

  const handleCopy = () => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!qrRef.current) return;
    const qrCanvas = qrRef.current.querySelector("canvas");
    if (!qrCanvas) return;
    
    // Create a new canvas to combine the QR code and the text
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    // Dimensions
    const padding = 20;
    const textSpace = 50;
    canvas.width = qrCanvas.width + padding * 2;
    canvas.height = qrCanvas.height + padding * 2 + textSpace;
    
    // 1. Fill background with white
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 2. Draw the QR Code
    ctx.drawImage(qrCanvas, padding, padding);
    
    // 3. Draw the restaurant name below the QR Code
    ctx.fillStyle = "#000000"; // text color
    ctx.font = "bold 22px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    
    // Center the text horizontally, and place it below the QR code
    ctx.fillText(restaurantName, canvas.width / 2, padding + qrCanvas.height + 10);
    
    // Generate the download link from the composite canvas
    const pngUrl = canvas.toDataURL("image/png");
      
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${restaurantName}_Menu_QR.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text flex items-center gap-2">
            <FiShare2 className="text-primary-500" />
            Share Menu
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-text-muted transition-colors hover:bg-surface-elevated hover:text-text"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl mb-6">
          <div ref={qrRef}>
            {url ? (
              <QRCodeCanvas value={url} size={200} level="H" includeMargin={true} />
            ) : (
              <div className="h-[200px] w-[200px] bg-gray-100 animate-pulse rounded-lg flex items-center justify-center text-gray-400">Loading...</div>
            )}
          </div>
          <button
            onClick={handleDownload}
            className="mt-6 flex items-center gap-2 rounded-lg bg-surface-alt border border-border px-4 py-2 text-sm font-medium text-text hover:bg-surface-elevated transition-colors"
          >
            <FiDownload size={16} />
            Download QR Code
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text-muted">Direct Link</label>
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              readOnly 
              value={url} 
              className="flex-1 rounded-lg border border-border bg-surface-alt px-3 py-2 text-sm text-text focus:outline-none"
            />
            <button 
              onClick={handleCopy}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors"
              title="Copy Link"
            >
              {copied ? <FiCheck size={18} /> : <FiCopy size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
