"use client";

import { useState, useRef } from "react";
import { QrCode, Camera, CheckCircle2, AlertCircle, RefreshCw, X } from "lucide-react";
import { useToast } from "@/components/ui/toast-provider";

interface QrCameraScannerProps {
  onScanSuccess?: (workerId: string) => void;
}

export function QrCameraScanner({ onScanSuccess }: QrCameraScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { showToast } = useToast();

  const startCamera = async () => {
    try {
      setIsScanning(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      showToast("Site Engineer Mobile Camera activated", "info");
    } catch (err) {
      console.error("Camera access error:", err);
      showToast("Camera access unavailable. Use manual QR Code entry below.", "warning");
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const handleSimulateScan = (id: string) => {
    setLastScanned(id);
    showToast(`Worker QR Scanned Successfully: ID #${id}`, "success");
    if (onScanSuccess) {
      onScanSuccess(id);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Site Worker QR Check-In</h3>
            <p className="text-xs text-slate-400">Live Mobile Camera QR Badge Scanner</p>
          </div>
        </div>

        {!isScanning ? (
          <button
            onClick={startCamera}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>Open Camera</span>
          </button>
        ) : (
          <button
            onClick={stopCamera}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 text-xs font-medium transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>Stop</span>
          </button>
        )}
      </div>

      {isScanning && (
        <div className="relative rounded-xl overflow-hidden border-2 border-cyan-500/40 bg-black aspect-video flex items-center justify-center">
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          <div className="absolute inset-0 border-2 border-dashed border-cyan-400/60 m-8 rounded-lg pointer-events-none animate-pulse flex items-center justify-center">
            <span className="text-[10px] uppercase tracking-widest text-cyan-300 bg-slate-950/80 px-3 py-1 rounded-full font-mono">
              Align Worker QR Badge
            </span>
          </div>
        </div>
      )}

      {lastScanned && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Scanned Worker: <strong className="text-white">ID #{lastScanned}</strong>
            </span>
          </div>
          <span className="text-[10px] text-emerald-400/80 font-mono">PRESENT TODAY</span>
        </div>
      )}

      {/* Manual Entry Fallback */}
      <div className="pt-2 border-t border-slate-800/80 space-y-2">
        <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
          Manual QR / Worker ID Override
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="e.g. WORKER-101"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
          />
          <button
            onClick={() => {
              if (manualCode.trim()) {
                handleSimulateScan(manualCode.trim());
                setManualCode("");
              }
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
          >
            Check-In
          </button>
        </div>
      </div>
    </div>
  );
}
