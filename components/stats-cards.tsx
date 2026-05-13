import { Card, CardContent } from "@/components/ui/card"
import { FileText, FileCheck, File } from "lucide-react"

const stats = [
  {
    icon: FileText,
    label: "DOKUMEN MOU",
    value: "0 Data",
    activeCount: "0 Data Aktif",
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
  },
  {
    icon: FileCheck,
    label: "DOKUMEN MOA",
    value: "0 Data",
    activeCount: "0 Data Aktif",
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
  },
  {
    icon: File,
    label: "DOKUMEN IA",
    value: "1 Data",
    activeCount: "0 Data Aktif",
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
  },
]

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="border border-border hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.activeCount}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
