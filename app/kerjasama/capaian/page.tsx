"use client";

import { useState, useMemo, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RefreshCcw, ArrowLeft } from "lucide-react";

/* ================= RECHARTS ================= */
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

/* ================= TYPES ================= */

type TargetData = {
  tahun: number;
  mou: number;
  moa: number;
  ia: number;
};

type RealisasiData = {
  aktif: number;
  perpanjangan: number;
  kadaluarsa: number;
  tidakAktif: number;
};

/* ================= DUMMY DATA ================= */

// target hanya ada di 2023
const TARGET_BY_YEAR: Record<number, TargetData | null> = {
  2022: null,
  2023: { tahun: 2023, mou: 10, moa: 5, ia: 5 },
  2024: null,
  2025: null,
  2026: null,
};

// realisasi hanya ada di 2023
const REALISASI_BY_YEAR: Record<number, RealisasiData | null> = {
  2022: null,
  2023: {
    aktif: 6,
    perpanjangan: 2,
    kadaluarsa: 1,
    tidakAktif: 1,
  },
  2024: null,
  2025: null,
  2026: null,
};

const CHART_COLORS = ["#6366f1", "#e5e7eb"]; // indigo & gray

/* ================= PAGE ================= */

export default function CapaianKerjasamaPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const [tahun, setTahun] = useState(2023);
  useEffect(() => {
    document.title = "SIKERMA - Capaian Kerjasama";
  }, []);

  const target = TARGET_BY_YEAR[tahun];
  const realisasi = REALISASI_BY_YEAR[tahun];

  const totalTarget = target ? target.mou + target.moa + target.ia : 0;

  const totalRealisasi = realisasi
    ? realisasi.aktif +
    realisasi.perpanjangan +
    realisasi.kadaluarsa +
    realisasi.tidakAktif
    : 0;

  const capaianPersen =
    totalTarget === 0
      ? 0
      : Math.min(100, Math.round((totalRealisasi / totalTarget) * 100));

  const chartData = [
    { name: "Tercapai", value: capaianPersen },
    { name: "Belum", value: 100 - capaianPersen },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* SIDEBAR */}
      <Sidebar
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        onExpandChange={setSidebarExpanded}
      />

      {/* CONTENT */}
      <div
        className={cn(
          "relative transition-all duration-300",
          "ml-0",
          sidebarExpanded ? "md:ml-64" : "md:ml-[72px]",
        )}
      >
        <div className="flex flex-col min-h-screen">
          <Header onMenuClick={() => setSidebarOpen(true)} />

          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* TITLE */}
              <div className="flex items-center justify-between">
                <h1 className="text-xl md:text-2xl font-bold">
                  Capaian Kerjasama
                </h1>

                <div className="flex gap-1 flex-wrap">
                  {[2022, 2023, 2024, 2025, 2026].map((y) => (
                    <Button
                      key={y}
                      size="sm"
                      variant={tahun === y ? "default" : "outline"}
                      onClick={() => setTahun(y)}
                    >
                      {y}
                    </Button>
                  ))}
                </div>
              </div>

              {/* GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* TARGET */}
                <div className="rounded-lg border bg-card p-4 space-y-4">
                  <h2 className="font-semibold">Target Tahun {tahun}</h2>

                  {!target ? (
                    <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                      Tidak ada data target tahun {tahun}! Silahkan isi data
                      target kinerja kerjasama tahun {tahun} pada menu
                      <b> TARGET</b>.
                    </div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead className="bg-muted/40">
                        <tr>
                          <th className="px-2 py-1 text-left">Jenis Dokumen</th>
                          <th className="px-2 py-1 text-right">
                            Jumlah Dokumen
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-purple-50">
                          <td className="px-2 py-1">MoU</td>
                          <td className="px-2 py-1 text-right">{target.mou}</td>
                        </tr>
                        <tr className="bg-blue-50">
                          <td className="px-2 py-1">MoA</td>
                          <td className="px-2 py-1 text-right">{target.moa}</td>
                        </tr>
                        <tr className="bg-green-50">
                          <td className="px-2 py-1">IA</td>
                          <td className="px-2 py-1 text-right">{target.ia}</td>
                        </tr>
                        <tr className="bg-red-50 font-semibold">
                          <td className="px-2 py-1">Total</td>
                          <td className="px-2 py-1 text-right">
                            {totalTarget}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                </div>

                {/* GRAFIK (RECHARTS) */}
                <div className="rounded-lg border bg-card p-4">
                  <h2 className="font-semibold mb-4 text-center">
                    Grafik Capaian Kinerja
                  </h2>

                  <div className="relative h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          dataKey="value"
                          innerRadius={60}
                          outerRadius={90}
                          startAngle={90}
                          endAngle={-270}
                          paddingAngle={2}
                        >
                          {chartData.map((_, index) => (
                            <Cell key={index} fill={CHART_COLORS[index]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>

                    {/* CENTER TEXT */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xs text-muted-foreground">
                        CAPAIAN
                      </span>
                      <span className="text-3xl font-bold">
                        {capaianPersen}%
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {totalRealisasi} / {totalTarget} dokumen
                      </span>
                    </div>
                  </div>
                </div>

                {/* REALISASI */}
                <div className="rounded-lg border bg-card p-4 space-y-4">
                  <h2 className="font-semibold">Realisasi Tahun {tahun}</h2>

                  {!realisasi ? (
                    <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                      Tidak ada data dokumen kerjasama yang dibuat tahun {tahun}
                      ! Silahkan isi data kerjasama tahun {tahun}
                      pada menu <b>TARGET</b>.
                    </div>
                  ) : (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between bg-blue-50 px-3 py-2 rounded">
                        <span>Aktif</span>
                        <span>{realisasi.aktif} data</span>
                      </div>
                      <div className="flex justify-between bg-sky-50 px-3 py-2 rounded">
                        <span>Perpanjangan</span>
                        <span>{realisasi.perpanjangan} data</span>
                      </div>
                      <div className="flex justify-between bg-yellow-50 px-3 py-2 rounded">
                        <span>Kadaluarsa</span>
                        <span>{realisasi.kadaluarsa} data</span>
                      </div>
                      <div className="flex justify-between bg-red-50 px-3 py-2 rounded">
                        <span>Tidak Aktif</span>
                        <span>{realisasi.tidakAktif} data</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
