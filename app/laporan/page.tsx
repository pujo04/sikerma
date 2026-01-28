"use client";

import { useState, useMemo, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RefreshCcw, ArrowLeft, Download } from "lucide-react";
import { SearchableSelect } from "@/components/ui/searchable-select";

/* ================= TYPES ================= */

type LaporanData = {
tahun: number;
mou: number;
moa: number;
ia: number;
aktif: number;
kadaluarsa: number;
perpanjangan: number;
tidakAktif: number;
};


/* ================= DUMMY DATA ================= */

const LAPORAN_DUMMY: LaporanData[] = [
{
  tahun: 2022,
  mou: 0,
  moa: 0,
  ia: 0,
  aktif: 0,
  kadaluarsa: 0,
  perpanjangan: 0,
  tidakAktif: 0,
},
{
  tahun: 2023,
  mou: 0,
  moa: 0,
  ia: 1,
  aktif: 0,
  kadaluarsa: 0,
  perpanjangan: 0,
  tidakAktif: 1,
},
{
  tahun: 2024,
  mou: 0,
  moa: 0,
  ia: 0,
  aktif: 0,
  kadaluarsa: 0,
  perpanjangan: 0,
  tidakAktif: 0,
},
{
  tahun: 2025,
  mou: 0,
  moa: 0,
  ia: 0,
  aktif: 0,
  kadaluarsa: 0,
  perpanjangan: 0,
  tidakAktif: 0,
},
{
  tahun: 2026,
  mou: 0,
  moa: 0,
  ia: 0,
  aktif: 0,
  kadaluarsa: 0,
  perpanjangan: 0,
  tidakAktif: 0,
},
];

/* ================= PAGE ================= */

export default function LaporanKerjasamaPage() {
const [sidebarOpen, setSidebarOpen] = useState(false);
const [sidebarExpanded, setSidebarExpanded] = useState(false);
useEffect(() => {
  document.title = "SIKERMA - Laporan";
}, []);
const [tahun, setTahun] = useState<"all" | number>("all");
const tahunOptions = [
{ label: "Semua", value: "all" },
{ label: "2026", value: 2026 },
{ label: "2025", value: 2025 },
{ label: "2024", value: 2024 },
{ label: "2023", value: 2023 },
{ label: "2022", value: 2022 },
];

/* ================= FILTER DATA ================= */

const laporan = useMemo(() => {
  if (tahun === "all") {
    return LAPORAN_DUMMY.reduce(
      (acc, cur) => ({
        tahun: 0,
        mou: acc.mou + cur.mou,
        moa: acc.moa + cur.moa,
        ia: acc.ia + cur.ia,
        aktif: acc.aktif + cur.aktif,
        kadaluarsa: acc.kadaluarsa + cur.kadaluarsa,
        perpanjangan: acc.perpanjangan + cur.perpanjangan,
        tidakAktif: acc.tidakAktif + cur.tidakAktif,
      }),
      {
        tahun: 0,
        mou: 0,
        moa: 0,
        ia: 0,
        aktif: 0,
        kadaluarsa: 0,
        perpanjangan: 0,
        tidakAktif: 0,
      }
    );
  }

  return LAPORAN_DUMMY.find((d) => d.tahun === tahun)!;
}, [tahun]);

const totalJenis = laporan.mou + laporan.moa + laporan.ia;
const totalStatus =
  laporan.aktif +
  laporan.kadaluarsa +
  laporan.perpanjangan +
  laporan.tidakAktif;

return (
  <div className="min-h-screen bg-background">
    <Sidebar
      open={sidebarOpen}
      onOpenChange={setSidebarOpen}
      onExpandChange={setSidebarExpanded}
    />

    <div
      className={cn(
        "relative transition-all duration-300",
        sidebarExpanded ? "md:ml-64" : "md:ml-[72px]"
      )}
    >
      <Header onMenuClick={() => setSidebarOpen(true)} />

      <main className="p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* TITLE */}
          <div className="flex items-center justify-between">
            <h1 className="text-xl md:text-2xl font-bold">
              Laporan Kerjasama
            </h1>
          </div>

          {/* FILTER */}
        <div className="flex items-center justify-between">
<div className="flex items-center gap-2 text-sm">
  <span>Pilih Tahun:</span>

  <SearchableSelect
    options={tahunOptions}
    value={tahun}
    placeholder="Pilih Tahun"
    onChange={(val) => setTahun(val)}
    className="w-[200px]"
  />
</div>

<div className="flex gap-2">
  <Button size="sm" variant="outline">
    Download PDF
  </Button>
  <Button size="sm" variant="outline">
    Download Excel
  </Button>
</div>
</div>

          {/* CONTENT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* JENIS DOKUMEN */}
            <div className="rounded-lg border bg-card p-4">
              <h2 className="font-semibold mb-3">Jenis Dokumen</h2>

              <div className="space-y-2 text-sm">
                <Row label="Dokumen MoU" value={laporan.mou} />
                <Row label="Dokumen MoA" value={laporan.moa} />
                <Row label="Dokumen IA" value={laporan.ia} />
                <div className="flex justify-between font-semibold bg-muted/40 px-3 py-2 rounded">
                  <span>Total Dokumen</span>
                  <span>{totalJenis} Dokumen</span>
                </div>
              </div>
            </div>

            {/* STATUS DOKUMEN */}
            <div className="rounded-lg border bg-card p-4">
              <h2 className="font-semibold mb-3">Status Dokumen</h2>

              <div className="space-y-2 text-sm">
                <Row label="Dokumen Aktif" value={laporan.aktif} />
                <Row label="Dokumen Kadaluarsa" value={laporan.kadaluarsa} />
                <Row label="Dokumen Perpanjangan" value={laporan.perpanjangan} />
                <Row label="Dokumen Tidak Aktif" value={laporan.tidakAktif} />
                <div className="flex justify-between font-semibold bg-muted/40 px-3 py-2 rounded">
                  <span>Total Dokumen</span>
                  <span>{totalStatus} Dokumen</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
);
}

/* ================= HELPER ================= */

function Row({ label, value }: { label: string; value: number }) {
return (
  <div className="flex justify-between px-3 py-2 border rounded">
    <span>{label}</span>
    <span>{value} Dokumen</span>
  </div>
);
}
