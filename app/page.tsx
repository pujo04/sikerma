"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { StatsCards } from "@/components/stats-cards";
import { DonutChart } from "@/components/donut-chart";
import { BarChart } from "@/components/bar-chart";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  useEffect(() => {
    document.title = "SIKERMA - Dashboard";
  }, []);

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
          "ml-0",
          sidebarExpanded ? "md:ml-64" : "md:ml-[72px]",
        )}
      >
        <div className="flex flex-col min-h-screen">
          <Header onMenuClick={() => setSidebarOpen(true)} />

          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
              <h1 className="text-2xl md:text-3xl font-bold">
                Informasi Kerjasama
              </h1>

              <p className="text-sm text-muted-foreground">
                Dashboard statistik dokumen kerjasama
              </p>

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
