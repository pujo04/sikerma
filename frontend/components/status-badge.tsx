import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  status: string;
  className?: string;
};

const statusStyles: Record<string, string> = {
  Aktif: "bg-green-600 text-white border-green-600",
  TidakAktif: "bg-gray-600 text-white border-gray-600",
  Kadaluarsa: "bg-red-600 text-white border-red-600",
  DalamPerpanjangan: "bg-yellow-500 text-white border-yellow-500",
};

const statusLabels: Record<string, string> = {
  TidakAktif: "Tidak Aktif",
  DalamPerpanjangan: "Dalam Perpanjangan",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalized = (status || "").trim().replace(/\s+/g, "");

  const style = statusStyles[normalized] || statusStyles["TidakAktif"];
  const label = statusLabels[normalized] || normalized;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        style,
        className
      )}
    >
      {label}
    </span>
  );
}
