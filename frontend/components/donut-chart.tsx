"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { Loader2 } from "lucide-react";

type DonutData = {
  name: string;
  value: number;
  color: string;
  detail: string;
};

export function DonutChart({ data = [], loading = false }: { data: DonutData[]; loading?: boolean }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const TOTAL = useMemo(
    () => data.reduce((sum, d) => sum + d.value, 0),
    [data]
  );

  if (loading) {
    return (
      <Card className="border border-border animate-pulse">
        <CardHeader>
          <div className="h-4 w-1/3 bg-muted rounded" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center">
            <div className="w-52 h-52 rounded-full bg-muted flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
            <div className="mt-6 w-full space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 bg-muted rounded-md" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Distribusi Status Dokumen
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col items-center">
          {/* DONUT */}
          <div className="relative w-56 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                  cursor="pointer"
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  animationDuration={800}
                  animationEasing="ease-out"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      strokeWidth={activeIndex === index ? 3 : 0}
                      stroke={activeIndex === index ? "#fff" : "transparent"}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* CENTER TEXT */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              {activeIndex !== null ? (
                <>
                  <p
                    className="text-[10px] font-medium uppercase tracking-wider"
                    style={{ color: data[activeIndex].color }}
                  >
                    {data[activeIndex].name}
                  </p>
                  <p className="text-3xl font-extrabold text-foreground">
                    {data[activeIndex].value}
                  </p>
                  <p className="text-[10px] text-muted-foreground">dokumen</p>
                </>
              ) : (
                <>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total</p>
                  <p className="text-3xl font-extrabold text-foreground">{TOTAL}</p>
                  <p className="text-[10px] text-muted-foreground">dokumen</p>
                </>
              )}
            </div>

            {/* FLOATING TOOLTIP */}
            {activeIndex !== null && (
              <div
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-xl text-xs font-semibold text-white shadow-lg whitespace-nowrap"
                style={{ backgroundColor: data[activeIndex].color }}
              >
                {data[activeIndex].name} — {data[activeIndex].value} dokumen
              </div>
            )}
          </div>

          {/* LEGEND with progress bar */}
          <div className="mt-8 w-full space-y-4">
            {data.map((item, index) => {
              const isActive = activeIndex === index;
              const pct = TOTAL === 0 ? 0 : Math.round((item.value / TOTAL) * 100);
              return (
                <div key={index}>
                  <div
                    className={`flex items-center justify-between text-sm cursor-pointer rounded-lg px-3 py-2 transition-all
                      ${isActive ? "bg-muted shadow-sm" : "hover:bg-muted/40"}`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-sm"
                        style={{
                          backgroundColor: item.color,
                          opacity: activeIndex === null || isActive ? 1 : 0.3,
                          transition: "opacity 0.2s",
                        }}
                      />
                      <div>
                        <p
                          className="font-semibold text-sm"
                          style={{ color: isActive ? item.color : undefined }}
                        >
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.detail}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className="font-bold text-base"
                        style={{ color: isActive ? item.color : undefined }}
                      >
                        {item.value}
                      </p>
                      <p className="text-xs text-muted-foreground">{pct}%</p>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="h-1.5 rounded-full bg-muted mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: item.color,
                        opacity: activeIndex === null || isActive ? 1 : 0.3,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}