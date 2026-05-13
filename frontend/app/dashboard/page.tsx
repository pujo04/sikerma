"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { StatsCards } from "@/components/stats-cards";
import { DonutChart } from "@/components/donut-chart";
import { BarChart } from "@/components/bar-chart";
import { cn } from "@/lib/utils";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  LayoutGrid,
  BarChart2,
} from "lucide-react";

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const { stats, donut, bar, loading } = useDashboardData();

  useEffect(() => {
    document.title = "SIKERMA - Dashboard";
  }, []);

  const totalDocs = donut.reduce((s, d) => s + d.value, 0);
  const aktifDocs = donut.find((d) => d.name === "Aktif")?.value ?? 0;
  const kadaluarsaDocs = donut.find((d) => d.name === "Kadaluarsa")?.value ?? 0;
  const perpanjanganDocs = donut.find((d) => d.name === "Perpanjangan")?.value ?? 0;
  const tidakAktifDocs = donut.find((d) => d.name === "Tidak Aktif")?.value ?? 0;

  const pctAktif = totalDocs === 0 ? 0 : Math.round((aktifDocs / totalDocs) * 100);
  const pctPerpanjangan = totalDocs === 0 ? 0 : Math.round((perpanjanganDocs / totalDocs) * 100);
  const pctKadaluarsa = totalDocs === 0 ? 0 : Math.round((kadaluarsaDocs / totalDocs) * 100);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} onExpandChange={setSidebarExpanded} />

      <div
        className={cn(
          "relative transition-all duration-300",
          "ml-0",
          sidebarExpanded ? "md:ml-64" : "md:ml-[72px]"
        )}
      >
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* SECTION 1: HEADER */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Dashboard Kerjasama</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Ringkasan statistik dokumen capaian kerjasama
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground hidden sm:block">
                  {new Date().toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>

            {/* SECTION 2: STATS CARDS (MOU, MOA, IA) */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <LayoutGrid className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                  Statistik Dokumen
                </h2>
              </div>
              <StatsCards stats={stats} loading={loading} />
            </div>

            {/* SECTION 3: QUICK STATS (Aktif, Perpanjangan, Kadaluarsa) */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <BarChart2 className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                  Status Dokumen
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* AKTIF */}
                <Card className="border border-green-200 bg-green-50/50 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="pt-5 pb-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-green-700 font-medium uppercase tracking-wide">Aktif</p>
                        <p className="text-2xl font-bold text-foreground mt-0.5">{aktifDocs}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <TrendingUp className="w-3 h-3 text-green-500" />
                          <span className="text-xs text-green-600 font-medium">{pctAktif}% dari total</span>
                        </div>
                      </div>
                      {/* Progress mini */}
                      <div className="w-2 h-16 rounded-full bg-green-200 overflow-hidden flex flex-col-reverse">
                        <div
                          className="bg-green-500 rounded-full transition-all duration-700"
                          style={{ height: `${pctAktif}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* PERPANJANGAN */}
                <Card className="border border-blue-200 bg-blue-50/50 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="pt-5 pb-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                        <Clock className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-blue-700 font-medium uppercase tracking-wide">Perpanjangan</p>
                        <p className="text-2xl font-bold text-foreground mt-0.5">{perpanjanganDocs}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <AlertTriangle className="w-3 h-3 text-blue-500" />
                          <span className="text-xs text-blue-600 font-medium">Segera expires</span>
                        </div>
                      </div>
                      <div className="w-2 h-16 rounded-full bg-blue-200 overflow-hidden flex flex-col-reverse">
                        <div
                          className="bg-blue-500 rounded-full transition-all duration-700"
                          style={{ height: `${pctPerpanjangan}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* KADALUARSA */}
                <Card className="border border-yellow-200 bg-yellow-50/50 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="pt-5 pb-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-yellow-700 font-medium uppercase tracking-wide">Kadaluarsa</p>
                        <p className="text-2xl font-bold text-foreground mt-0.5">{kadaluarsaDocs}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <TrendingDown className="w-3 h-3 text-yellow-500" />
                          <span className="text-xs text-yellow-600 font-medium">Perlu evaluasi</span>
                        </div>
                      </div>
                      <div className="w-2 h-16 rounded-full bg-yellow-200 overflow-hidden flex flex-col-reverse">
                        <div
                          className="bg-yellow-500 rounded-full transition-all duration-700"
                          style={{ height: `${pctKadaluarsa}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* SECTION 4: VISUALISASI DATA + CAPAIAN KERJASAMA */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 rounded border border-primary/30 bg-primary/10 flex items-center justify-center">
                  <BarChart2 className="w-3 h-3 text-primary" />
                </div>
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                  Visualisasi Data
                </h2>
              </div>

              {/* Grid 2 kolom: kiri=donut, kanan=bar+capaian (setinggi donut) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Kolom Kiri: Donut Chart (setinggi 100%) */}
                <div className="flex flex-col">
                  <DonutChart data={donut} loading={loading} />
                </div>

                {/* Kolom Kanan: BarChart + Capaian Card (tinggi match donut) */}
                <div className="flex flex-col gap-6">
                  <BarChart data={bar} loading={loading} />

                  <Card
                    className="border shadow-sm cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
                    onClick={() => (window.location.href = "/kerjasama/capaian")}
                  >
                    <CardContent className="pt-5 pb-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-foreground">Capaian Kerjasama</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Lihat statistik capaian kinerja & tren per tahun
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-primary shrink-0">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <ChevronRight className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}