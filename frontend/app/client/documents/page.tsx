"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import { Header } from "@/components/navigation/header";
import { useToast } from "@/components/ui/toast-provider";
import { FileSpreadsheet, Download, FileText, ShieldCheck, Search, Filter, RefreshCw } from "lucide-react";

export default function ClientDocumentsPage() {
  const { showToast } = useToast();
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const [contractRes, projRes] = await Promise.all([
        fetch("/api/contracts"),
        fetch("/api/projects"),
      ]);
      const [contractJson, projJson] = await Promise.all([
        contractRes.json(),
        projRes.json(),
      ]);

      const realDocs: any[] = [];

      if (contractJson.success && contractJson.data && contractJson.data.length > 0) {
        contractJson.data.forEach((c: any) => {
          realDocs.push({
            id: c.id,
            title: `${c.subcontractorName} - ${c.tradeScope} Contract`,
            type: "CONTRACT",
            date: new Date(c.createdAt).toLocaleDateString(),
            size: "$ " + Number(c.contractValue || 0).toLocaleString(),
          });
        });
      }

      if (projJson.success && projJson.data && projJson.data.length > 0) {
        projJson.data.forEach((p: any) => {
          realDocs.push({
            id: `plan-${p.id}`,
            title: `${p.name} - Architectural Master Blueprint`,
            type: "BLUEPRINT",
            date: new Date(p.createdAt).toLocaleDateString(),
            size: "14.8 MB",
          });
        });
      }

      if (realDocs.length > 0) {
        setDocuments(realDocs);
      } else {
        setDocuments([
          { id: "doc-1", title: "Skyline Towers Phase 1 - Master Construction Agreement", type: "CONTRACT", date: new Date().toLocaleDateString(), size: "2.4 MB" },
          { id: "doc-2", title: "Architectural Structural Blueprints (Rev 3.0)", type: "BLUEPRINT", date: new Date().toLocaleDateString(), size: "14.8 MB" },
        ]);
      }
    } catch (e) {
      showToast("Error loading document vault", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);


  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar role="CLIENT" />

      <div className="flex-1 flex flex-col min-w-0">
        <Header userName="Acme Representative" userRole="Client Portal User" />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1 overflow-y-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-amber-500/15 via-orange-500/5 to-slate-900 p-6 rounded-3xl border border-amber-500/25 shadow-xl">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                Client Vault
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-white mt-2 flex items-center gap-3">
                <FileSpreadsheet className="w-7 h-7 text-amber-400" /> Project Legal & Technical Documents
              </h2>
              <p className="text-sm text-slate-400 mt-1">Verified architectural blueprints, contracts, and quality certificates.</p>
            </div>
          </div>

          <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl backdrop-blur-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase">
                    <th className="py-3 px-4">Document Title</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Date Uploaded</th>
                    <th className="py-3 px-4">File Size</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-100 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-amber-400" /> {doc.title}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                          {doc.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">{doc.date}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-300">{doc.size}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => showToast(`Downloading ${doc.title}...`, "success")}
                          className="px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold hover:border-amber-500 transition-all flex items-center gap-1.5 ml-auto"
                        >
                          <Download className="w-3.5 h-3.5 text-amber-400" /> Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
