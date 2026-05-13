"use client";
import { useEffect, useMemo, useState } from "react";
import API from "@/lib/api-config";

export type RepoDoc = {
  id: number;
  jenis: "MOU" | "MOA" | "IA";
  status: "Aktif" | "Tidak Aktif";
  tglMulai: string;
};

export function useDashboardData() {
  const [raw, setRaw] = useState<RepoDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API.repositoryMydata, { credentials: "include" })
      .then(r => r.json())
      .then(res =>
        setRaw(
          res.map((r: any) => ({
            id: r.id,
            jenis: r.jenisDokumen,
            status: r.statusDokumen === "Aktif" ? "Aktif" : "Tidak Aktif",
            tglMulai: r.tanggalMulai,
            tglBerakhir: r.tanggalBerakhir,   // ← tambah ini
          }))
        )
      )
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const count = (j: string) => raw.filter(d => d.jenis === j).length;
    const active = (j: string) =>
      raw.filter(d => d.jenis === j && d.status === "Aktif").length;

    return {
      MOU: { total: count("MOU"), aktif: active("MOU") },
      MOA: { total: count("MOA"), aktif: active("MOA") },
      IA: { total: count("IA"), aktif: active("IA") },
    };
  }, [raw]);

const donut = useMemo(() => {
  const now = new Date();

  const summary: any = {
    Aktif: { total: 0, MOU: 0, MOA: 0, IA: 0 },
    Kadaluarsa: { total: 0, MOU: 0, MOA: 0, IA: 0 },
    Perpanjangan: { total: 0, MOU: 0, MOA: 0, IA: 0 },
    "Tidak Aktif": { total: 0, MOU: 0, MOA: 0, IA: 0 },
  };

  raw.forEach((d: any) => {
    const end = new Date(d.tglBerakhir);
    const diffDays =
      (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

    let kategori = "Aktif";

    if (d.status === "Tidak Aktif") {
      kategori = "Tidak Aktif";
    } else if (end < now) {
      kategori = "Kadaluarsa";
    } else if (diffDays <= 90) {
      kategori = "Perpanjangan";
    }

    summary[kategori].total++;
    summary[kategori][d.jenis]++;
  });

  return [
    {
      name: "Aktif",
      value: summary.Aktif.total,
      color: "#22c55e",
      detail: `MoU: ${summary.Aktif.MOU} | MoA: ${summary.Aktif.MOA} | IA: ${summary.Aktif.IA}`,
    },
    {
      name: "Kadaluarsa",
      value: summary.Kadaluarsa.total,
      color: "#facc15",
      detail: `MoU: ${summary.Kadaluarsa.MOU} | MoA: ${summary.Kadaluarsa.MOA} | IA: ${summary.Kadaluarsa.IA}`,
    },
    {
      name: "Perpanjangan",
      value: summary.Perpanjangan.total,
      color: "#3b82f6",
      detail: `MoU: ${summary.Perpanjangan.MOU} | MoA: ${summary.Perpanjangan.MOA} | IA: ${summary.Perpanjangan.IA}`,
    },
    {
      name: "Tidak Aktif",
      value: summary["Tidak Aktif"].total,
      color: "#f97316",
      detail: `MoU: ${summary["Tidak Aktif"].MOU} | MoA: ${summary["Tidak Aktif"].MOA} | IA: ${summary["Tidak Aktif"].IA}`,
    },
  ];
}, [raw]);

const bar = useMemo(() => {
  const now = new Date();
  const currentYear = now.getFullYear();

  // Generate 10 tahun terakhir
  const yearRange: number[] = [];
  for (let i = 9; i >= 0; i--) {
    yearRange.push(currentYear - i);
  }

  // Siapkan struktur default 0
  const years: Record<
    number,
    { year: string; MoU: number; MoA: number; IA: number }
  > = {};

  yearRange.forEach((year) => {
    years[year] = {
      year: year.toString(),
      MoU: 0,
      MoA: 0,
      IA: 0,
    };
  });

  // Isi data dari raw
  raw.forEach((d) => {
    const year = new Date(d.tglMulai).getFullYear();

    if (years[year]) {
      if (d.jenis === "MOU") years[year].MoU++;
      if (d.jenis === "MOA") years[year].MoA++;
      if (d.jenis === "IA") years[year].IA++;
    }
  });

  return Object.values(years);
}, [raw]);



  return { stats, donut, bar, loading };
}
