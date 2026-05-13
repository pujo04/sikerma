"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { Loader2 } from "lucide-react";

type DocKey = "MoU" | "MoA" | "IA";

type YearData = {
  year: string;
  MoU: number;
  MoA: number;
  IA: number;
};

const COLORS: Record<DocKey, string> = {
  MoU: "#6366f1",
  MoA: "#0ea5e9",
  IA: "#a855f7",
};

const COLOR_LIGHT: Record<DocKey, string> = {
  MoU: "rgba(99,102,241,0.15)",
  MoA: "rgba(14,165,233,0.15)",
  IA: "rgba(168,85,247,0.15)",
};

export function BarChart({ data = [], loading = false }: { data: YearData[]; loading: boolean }) {
  const [hiddenBars, setHiddenBars] = useState<Set<DocKey>>(new Set());

  const toggleBar = (key: DocKey) => {
    setHiddenBars((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const allKeys: DocKey[] = ["MoU", "MoA", "IA"];
  const visibleKeys = allKeys.filter((k) => !hiddenBars.has(k));

  const totalAll = data.reduce((sum, d) => {
    return sum + d.MoU + d.MoA + d.IA;
  }, 0);

  if (loading) {
    return (
      <Card className="border border-border animate-pulse shadow-sm">
        <CardHeader>
          <div className="h-4 w-2/5 bg-muted rounded mb-2" />
          <div className="flex gap-4">
            <div className="h-3 w-12 bg-muted rounded" />
            <div className="h-3 w-12 bg-muted rounded" />
            <div className="h-3 w-12 bg-muted rounded" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-muted rounded-xl flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <CardTitle className="text-base font-semibold">
            Tren Dokumen Kerjasama Per Tahun
          </CardTitle>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted-foreground text-xs">
              Klik legend untuk hide/show
            </span>
            <div className="flex items-center gap-4">
              {allKeys.map((key) => (
                <button
                  key={key}
                  onClick={() => toggleBar(key)}
                  className="flex items-center gap-1.5 cursor-pointer transition-opacity"
                  style={{ opacity: hiddenBars.has(key) ? 0.35 : 1 }}
                >
                  <div
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: COLORS[key] }}
                  />
                  <span className="text-xs font-medium">{key}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <RechartsBarChart
            data={data}
            margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
            barCategoryGap="25%"
            barGap={4}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted/60" vertical={false} />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              tickMargin={8}
            />
            <Tooltip
              cursor={{ fill: "rgba(0,0,0,0.04)" }}
              contentStyle={{
                borderRadius: 10,
                border: "1px solid hsl(var(--border))",
                backgroundColor: "hsl(var(--background))",
                fontSize: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                const total = payload.reduce((s, p) => s + (p.value as number), 0);
                return (
                  <div className="bg-background border rounded-xl px-4 py-3 shadow-lg text-xs space-y-1.5">
                    <p className="font-bold text-foreground text-sm mb-1">{label}</p>
                    {payload.map((p) => (
                      <div key={p.name} className="flex items-center justify-between gap-6">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: p.color }} />
                          <span>{p.name}</span>
                        </div>
                        <span className="font-bold">{p.value} dokumen</span>
                      </div>
                    ))}
                    <div className="border-t pt-1.5 mt-1.5 flex justify-between font-semibold">
                      <span>Total</span>
                      <span>{total} dokumen</span>
                    </div>
                  </div>
                );
              }}
            />

            {/* Animated bars */}
            {allKeys.map((key) => (
              <Bar
                key={key}
                dataKey={key}
                fill={COLORS[key]}
                radius={[6, 6, 0, 0]}
                maxBarSize={50}
                hide={hiddenBars.has(key)}
                animationDuration={800}
                animationEasing="ease-out"
              >
                {visibleKeys.includes(key) && (
                  <LabelList
                    dataKey={key}
                    position="top"
                    fontSize={10}
                    fill="hsl(var(--muted-foreground))"
                    formatter={(v: number) => (v > 0 ? v : "")}
                  />
                )}
              </Bar>
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>

        {/* SUMMARY */}
        <div className="mt-4 flex items-center justify-between border-t pt-4">
          <p className="text-xs text-muted-foreground">
            Total {totalAll} dokumen dalam {data.length} tahun
          </p>
          <div className="flex items-center gap-2">
            {allKeys.map((key) => {
              const total = data.reduce((s, d) => s + (d[key] || 0), 0);
              return (
                <div key={key} className="flex items-center gap-1.5 text-xs">
                  <span style={{ color: COLORS[key] }} className="font-semibold">{total}</span>
                  <span className="text-muted-foreground">{key}</span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}