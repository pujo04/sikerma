"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"

// ================= TYPES =================
type DocKey = "MoU" | "MoA" | "IA"

type YearData = {
  year: string
  MoU: number
  MoA: number
  IA: number
}

// ================= COLORS =================
const COLORS: Record<DocKey, string> = {
  MoU: "#22c55e",
  MoA: "#3b82f6",
  IA: "#facc15",
}

// ================= MOCK REALTIME =================
const fetchRealtimeData = (): Promise<YearData[]> =>
  new Promise((resolve) =>
    setTimeout(() => {
      resolve([
        { year: "2016", MoU: 0, MoA: 0, IA: 0 },
        { year: "2017", MoU: 0, MoA: 0, IA: 0 },
        { year: "2018", MoU: 0, MoA: 0, IA: 0 },
        { year: "2019", MoU: 0, MoA: 0, IA: 1 },
        { year: "2020", MoU: 0, MoA: 0, IA: 0 },
        { year: "2021", MoU: 0, MoA: 0, IA: 0 },
        { year: "2022", MoU: 0, MoA: 0, IA: 0 },
        { year: "2023", MoU: 0, MoA: 0, IA: 0 },
        { year: "2024", MoU: 0, MoA: 0, IA: 0 },
        { year: "2025", MoU: 0, MoA: 0, IA: 0 },
      ])
    }, 1200)
  )

// ================= COMPONENT =================
export function BarChart() {
  const [activeKeys, setActiveKeys] = useState<DocKey[]>([])
  const [data, setData] = useState<YearData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRealtimeData().then((res) => {
      setData(res)
      setLoading(false)
    })
  }, [])

  // ================= STATISTIK =================
  const totals = useMemo(() => {
    const sum = (key: DocKey) =>
      data.reduce((s, d) => s + d[key], 0)

    const visibleKeys =
      activeKeys.length > 0 ? activeKeys : ["MoU", "MoA", "IA"]

    const total = visibleKeys.reduce((s, k) => s + sum(k as DocKey), 0)

    const percent = (v: number) =>
      total === 0 ? "0%" : `${Math.round((v / total) * 100)}%`

    return {
      TOTAL: total,
      MoU: percent(sum("MoU")),
      MoA: percent(sum("MoA")),
      IA: percent(sum("IA")),
    }
  }, [data, activeKeys])

  // ================= SKELETON =================
  if (loading) {
    return (
      <Card className="border border-border animate-pulse">
        <CardHeader className="space-y-4">
          <div className="h-4 w-1/3 bg-muted rounded" />
          <div className="flex gap-6">
            <div className="h-4 w-16 bg-muted rounded" />
            <div className="h-4 w-16 bg-muted rounded" />
            <div className="h-4 w-16 bg-muted rounded" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-muted rounded" />
        </CardContent>
      </Card>
    )
  }

  // ================= UI =================
  return (
    <Card className="border border-border">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            Total Dokumen Kerjasama
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            Statistik Dokumen Kerjasama
          </span>
        </div>

        <div className="flex items-end justify-between">
          <div className="text-lg font-bold">
            {totals.TOTAL} Dokumen
          </div>

          <div className="flex gap-6 text-sm">
            {(Object.keys(COLORS) as DocKey[]).map((key) => (
              <div key={key} className="text-center">
                <p className="text-muted-foreground">{key}</p>
                <p className="font-medium" style={{ color: COLORS[key] }}>
                  {totals[key]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <RechartsBarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />

            {/* X AXIS */}
            <XAxis
              dataKey="year"
              tick={{
                fontSize: 12,
                fontFamily: "inherit",
                fill: "hsl(var(--muted-foreground))",
              }}
              tickLine={false}
              axisLine={false}
            />

            {/* Y AXIS */}
            <YAxis
              tick={{
                fontSize: 12,
                fontFamily: "inherit",
                fill: "hsl(var(--muted-foreground))",
              }}
              tickLine={false}
              axisLine={false}
            />

            {/* TOOLTIP */}
            <Tooltip
              cursor={{ fill: "rgba(0,0,0,0.05)" }}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null
                return (
                  <div className="rounded-lg border bg-background px-3 py-2 shadow-md text-xs font-sans space-y-1">
                    <p className="font-medium">{label}</p>
                    {payload.map((p) => (
                      <p key={p.name} style={{ color: p.color }}>
                        {p.name} : {p.value}
                      </p>
                    ))}
                  </div>
                )
              }}
            />

            {/* LEGEND */}
            <Legend
              iconType="square"
              formatter={(value) => {
                const active = activeKeys.includes(value as DocKey)
                return (
                  <span
                    style={{
                      fontFamily: "inherit",
                      fontSize: 12,
                      color:
                        active || activeKeys.length === 0
                          ? COLORS[value as DocKey]
                          : "#9ca3af",
                      fontWeight: active ? 600 : 400,
                      cursor: "pointer",
                    }}
                  >
                    {value}
                  </span>
                )
              }}
              onClick={(e) => {
                const key = e.dataKey as DocKey
                setActiveKeys((prev) =>
                  prev.includes(key)
                    ? prev.filter((k) => k !== key)
                    : [...prev, key]
                )
              }}
            />

            {/* BAR */}
            {(Object.keys(COLORS) as DocKey[]).map((key) => {
              const visible =
                activeKeys.length === 0 || activeKeys.includes(key)

              return (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={COLORS[key]}
                  radius={[4, 4, 0, 0]}
                  hide={!visible}
                  animationDuration={600}
                  animationEasing="ease-out"
                />
              )
            })}
          </RechartsBarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
