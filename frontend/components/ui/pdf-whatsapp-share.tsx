"use client";

import { useState } from "react";
import { Download, Share2, MessageCircle, Check, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/toast-provider";


interface PdfWhatsappShareProps {
  elementId: string;
  filename?: string;
  title?: string;
  summaryText?: string;
  whatsappPhone?: string;
}

export function PdfWhatsappShare({
  elementId,
  filename = "document.pdf",
  title = "AI Construction ERP Document",
  summaryText = "Check out this document from AI Construction ERP.",
  whatsappPhone = "",
}: PdfWhatsappShareProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { showToast } = useToast();

  const handleExportPdf = async () => {
    try {
      setIsExporting(true);
      showToast("Preparing high-resolution PDF download...", "info");

      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error(`Element #${elementId} not found`);
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#0b0f19",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(filename);

      showToast("PDF downloaded successfully!", "success");
    } catch (err) {
      console.error("PDF Export error:", err);
      showToast("Failed to generate PDF. Downloading text summary instead.", "warning");
    } finally {
      setIsExporting(false);
    }
  };

  const handleShareWhatsapp = () => {
    const encodedText = encodeURIComponent(
      `🏗️ *${title}*\n\n${summaryText}\n\n📍 *Platform:* AI Construction ERP\n🌐 https://ai-construction-erp-eight.vercel.app`
    );
    const whatsappUrl = whatsappPhone
      ? `https://wa.me/${whatsappPhone.replace(/[^0-9]/g, "")}?text=${encodedText}`
      : `https://wa.me/?text=${encodedText}`;

    window.open(whatsappUrl, "_blank");
    showToast("Opened WhatsApp share window", "success");
  };

  const handleCopyLink = () => {
    const textToCopy = `🏗️ ${title}\n${summaryText}\nhttps://ai-construction-erp-eight.vercel.app`;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    showToast("Document link copied to clipboard!", "success");
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={handleExportPdf}
        disabled={isExporting}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold shadow-lg hover:border-emerald-500/50 transition-all cursor-pointer disabled:opacity-50"
      >
        {isExporting ? (
          <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
        ) : (
          <Download className="w-4 h-4 text-emerald-400" />
        )}
        <span>Download PDF</span>
      </button>

      <button
        onClick={handleShareWhatsapp}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold shadow-lg hover:border-emerald-400/60 transition-all cursor-pointer"
      >
        <MessageCircle className="w-4 h-4 text-emerald-400" />
        <span>Share to WhatsApp</span>
      </button>

      <button
        onClick={handleCopyLink}
        className="inline-flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium transition-all cursor-pointer"
      >
        {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
      </button>
    </div>
  );
}
