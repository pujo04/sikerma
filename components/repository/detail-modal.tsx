"use client"

import { X, Download, LinkIcon, FileText, File } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DetailModalProps {
  document: any
  onClose: () => void
}

export function DetailModal({ document, onClose }: DetailModalProps) {
  const handleDownload = (type: string) => {
    console.log("[v0] Download:", type, document.nomor)
    alert(`Downloading ${type} for: ${document.nomor}`)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <h2 className="text-xl font-semibold text-foreground">Detail Dokumen Kerjasama</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 hover:bg-muted">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-4">
            {/* Detail Item */}
            <DetailItem label="Status Dokumen" value={document.statusDokumen} />
            <DetailItem label="Periode" value={document.periode} />
            <DetailItem label="Deskripsi" value={document.deskripsi} />
            <DetailItem label="Dasar Dokumen" value={document.dasarDokumen} />
            <DetailItem label="Unit Pelaksana" value={document.unitPelaksana} />
            <DetailItem label="Penanggung jawab" value={document.penanggungJawab} />
            <DetailItem label="Unit Penanggung jawab" value={document.unitPenanggungJawab} />
            <DetailItem label="Sumber Dana" value={document.sumberDana} />
            <DetailItem label="Anggaran" value={document.anggaran} />
            <DetailItem label="Bentuk Kegiatan" value={document.bentukKegiatan} />
            <DetailItem label="Para Penggiat" value={document.paraPenggiat} />
            <DetailItem label="Skala" value={document.skala} />

            {/* Download Files */}
            <div className="grid grid-cols-[200px,1fr] gap-4 border-t border-border pt-4">
              <div className="text-sm font-medium text-foreground">Download File</div>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-primary border-primary hover:bg-primary/10 bg-transparent"
                  onClick={() => handleDownload("File Dokumen")}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  File Dokumen
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-primary border-primary hover:bg-primary/10 bg-transparent"
                  onClick={() => handleDownload("Link Dokumen")}
                >
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Link Dokumen
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-green-600 border-green-600 hover:bg-green-50 bg-transparent"
                  onClick={() => handleDownload("Kontrak")}
                >
                  <File className="w-4 h-4 mr-2" />
                  Kontrak
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-muted-foreground border-border hover:bg-muted bg-transparent"
                  onClick={() => handleDownload("KAK")}
                >
                  <File className="w-4 h-4 mr-2" />
                  KAK
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-muted-foreground border-border hover:bg-muted bg-transparent"
                  onClick={() => handleDownload("RAB")}
                >
                  <Download className="w-4 h-4 mr-2" />
                  RAB
                </Button>
              </div>
            </div>

            {/* Claim Dokumen */}
            <div className="border-t border-border pt-4 text-center">
              <Button variant="outline" size="sm" className="text-muted-foreground bg-transparent">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Kalim Dokumen Ini?
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[200px,1fr] gap-4 border-b border-border pb-4">
      <div className="text-sm font-medium text-foreground">{label}</div>
      <div className="text-sm text-foreground whitespace-pre-line">{value}</div>
    </div>
  )
}
