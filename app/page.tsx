"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { StatsCards } from "@/components/stats-cards";
import { DonutChart } from "@/components/donut-chart";
import { BarChart } from "@/components/bar-chart";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* SIDEBAR */}
      <Sidebar
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        onExpandChange={setSidebarExpanded} // ⬅️ penting
      />

      {/* CONTENT WRAPPER */}
      <div
        className={cn(
          "relative transition-all duration-300",
          // mobile
          "ml-0",
          // desktop & ipad
          sidebarExpanded ? "md:ml-64" : "md:ml-[72px]"
        )}
      >
        <div className="flex flex-col min-h-screen">
          {/* HEADER */}
          <Header onMenuClick={() => setSidebarOpen(true)} />

          {/* MAIN */}
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  Informasi Kerjasama
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Dashboard statistik dokumen kerjasama
                </p>
              </div>

              <StatsCards />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <DonutChart />
                <div className="lg:col-span-2">
                  <BarChart />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
