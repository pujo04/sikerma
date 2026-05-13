import { Card, CardContent } from "@/components/ui/card";
import { FileText, FileCheck, File, Loader2 } from "lucide-react";

export function StatsCards({ stats, loading }: any) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border border-border rounded-xl">
            <CardContent className="p-6 flex items-center justify-center min-h-[100px]">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const data = [
    {
      icon: FileText,
      label: "DOKUMEN MOU",
      value: `${stats?.MOU?.total ?? 0} Data`,
      activeCount: `${stats?.MOU?.aktif ?? 0} Data Aktif`,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      icon: FileCheck,
      label: "DOKUMEN MOA",
      value: `${stats?.MOA?.total ?? 0} Data`,
      activeCount: `${stats?.MOA?.aktif ?? 0} Data Aktif`,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      icon: File,
      label: "DOKUMEN IA",
      value: `${stats?.IA?.total ?? 0} Data`,
      activeCount: `${stats?.IA?.aktif ?? 0} Data Aktif`,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {data.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className="border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-xl"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stat.activeCount}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center shadow-inner`}
                >
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}