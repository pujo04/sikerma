"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  RefreshCcw,
  Plus,
  ArrowLeft,
  Eye,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

/* ================= TYPES ================= */

type RealisasiKegiatan = {
  id: number;
  dokumen: string;
  judul: string;
  peserta: string;
  tanggal: string;
  anggaran: number;
};

/* ================= DUMMY DATA ================= */
/* Kosongkan array jika ingin tampil "No data available" */

const DUMMY_REALISASI: RealisasiKegiatan[] = [
  {
    id: 1,
    dokumen: "MoU",
    judul: "Workshop Implementasi Kerjasama Akademik",
    peserta: "Universitas Lampung",
    tanggal: "12-09-2023",
    anggaran: 25000000,
  },
  {
    id: 2,
    dokumen: "MoA",
    judul: "Pelatihan Pengembangan SDM",
    peserta: "Fakultas Teknik",
    tanggal: "20-09-2023",
    anggaran: 15000000,
  },
  {
    id: 3,
    dokumen: "IA",
    judul: "Penelitian Kolaboratif Pertanian",
    peserta: "Fakultas Pertanian",
    tanggal: "25-09-2023",
    anggaran: 30000000,
  },
  {
    id: 4,
    dokumen: "MoU",
    judul: "Seminar Nasional Kerjasama Pendidikan",
    peserta: "LPPM Unila",
    tanggal: "01-10-2023",
    anggaran: 20000000,
  },
  {
    id: 5,
    dokumen: "MoA",
    judul: "Program Magang Industri",
    peserta: "Mitra Industri",
    tanggal: "05-10-2023",
    anggaran: 40000000,
  },
  {
    id: 6,
    dokumen: "IA",
    judul: "Pengabdian Masyarakat Desa Binaan",
    peserta: "Fakultas Ekonomi",
    tanggal: "10-10-2023",
    anggaran: 12000000,
  },
  {
    id: 7,
    dokumen: "MoU",
    judul: "Kerjasama Penyelenggaraan Beasiswa",
    peserta: "Bank Mitra",
    tanggal: "15-10-2023",
    anggaran: 18000000,
  },
  {
    id: 8,
    dokumen: "MoA",
    judul: "Pelatihan Digital Marketing",
    peserta: "UMKM Binaan",
    tanggal: "18-10-2023",
    anggaran: 10000000,
  },
  {
    id: 9,
    dokumen: "IA",
    judul: "Riset Energi Terbarukan",
    peserta: "Fakultas MIPA",
    tanggal: "22-10-2023",
    anggaran: 35000000,
  },
  {
    id: 10,
    dokumen: "MoU",
    judul: "Kerjasama Internasional Pendidikan",
    peserta: "Universitas Luar Negeri",
    tanggal: "25-10-2023",
    anggaran: 50000000,
  },
  {
    id: 11,
    dokumen: "MoA",
    judul: "Program Dosen Praktisi",
    peserta: "Perusahaan Nasional",
    tanggal: "30-10-2023",
    anggaran: 22000000,
  },
  {
    id: 12,
    dokumen: "IA",
    judul: "Pelatihan Sistem Informasi",
    peserta: "UPT TIK",
    tanggal: "02-11-2023",
    anggaran: 8000000,
  },
  {
    id: 13,
    dokumen: "MoU",
    judul: "Kerjasama Penelitian Multidisiplin",
    peserta: "Konsorsium Riset",
    tanggal: "05-11-2023",
    anggaran: 45000000,
  },
  {
    id: 14,
    dokumen: "MoA",
    judul: "Program Sertifikasi Mahasiswa",
    peserta: "Lembaga Sertifikasi",
    tanggal: "08-11-2023",
    anggaran: 17000000,
  },
  {
    id: 15,
    dokumen: "IA",
    judul: "Workshop Penulisan Proposal Hibah",
    peserta: "Dosen Unila",
    tanggal: "12-11-2023",
    anggaran: 9000000,
  },
  {
    id: 16,
    dokumen: "MoU",
    judul: "Kerjasama Pengembangan Kurikulum",
    peserta: "Asosiasi Profesi",
    tanggal: "15-11-2023",
    anggaran: 26000000,
  },
  {
    id: 17,
    dokumen: "MoA",
    judul: "Program Teaching Factory",
    peserta: "SMK Mitra",
    tanggal: "18-11-2023",
    anggaran: 14000000,
  },
  {
    id: 18,
    dokumen: "IA",
    judul: "Pelatihan Keamanan Sistem Informasi",
    peserta: "Fakultas Ilmu Komputer",
    tanggal: "22-11-2023",
    anggaran: 16000000,
  },
  {
    id: 19,
    dokumen: "MoU",
    judul: "Kerjasama Penyelenggaraan Event Akademik",
    peserta: "Event Organizer",
    tanggal: "25-11-2023",
    anggaran: 21000000,
  },
  {
    id: 20,
    dokumen: "MoA",
    judul: "Program Inkubasi Startup",
    peserta: "Inkubator Bisnis",
    tanggal: "30-11-2023",
    anggaran: 38000000,
  },
];

/* ================= PAGE ================= */

export default function RealisasiKegiatanPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [fileRealisasi, setFileRealisasi] = useState<File | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
useEffect(() => {
  document.title = "SIKERMA - Realisasi Kegiatan";
}, []);

  const [newRealisasi, setNewRealisasi] = useState({
    dokumen: "",
    bentuk: "",
    judul: "",
    tanggal: "",
    anggaran: "",
    dosen: "",
    mahasiswa: "",
    hasil: "",
    file: null as File | null,
  });

  /* ================= FILTER ================= */

  const filteredData = useMemo(() => {
    return DUMMY_REALISASI.filter((item) =>
      `${item.dokumen} ${item.judul} ${item.peserta}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [search]);

  const totalPages = Math.ceil(filteredData.length / limit);

  const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

  useEffect(() => {
    setPage(1);
  }, [search, limit]);

  const startEntry = filteredData.length === 0 ? 0 : (page - 1) * limit + 1;
  const endEntry = Math.min(page * limit, filteredData.length);

  /* ================= PAGE NUMBERS ================= */

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    return [1, 2, 3, "...", totalPages];
  };

  return (
    <div className="min-h-screen bg-background">
      {/* SIDEBAR */}
      <Sidebar
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        onExpandChange={setSidebarExpanded}
      />

      {/* CONTENT */}
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
              {/* TITLE */}
              <div className="flex items-center justify-between">
                <h1 className="text-xl md:text-2xl font-bold">
                  Realisasi Kegiatan
                </h1>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowAddModal(true)}
                  >
                    Add
                  </Button>
                </div>
              </div>

              {/* CARD */}
              <div className="rounded-lg border bg-card">
                {/* CONTROLS */}
                <div className="p-4 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span>Show</span>
                    <select
                      value={limit}
                      onChange={(e) => setLimit(Number(e.target.value))}
                      className="border rounded px-2 py-1"
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                    <span>entries</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span>Search:</span>
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="border rounded px-2 py-1"
                      placeholder="Cari kegiatan..."
                    />
                  </div>
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-t">
                    <thead className="bg-muted/40">
                      <tr>
                        <th className="px-3 py-2 w-[60px]">No</th>
                        <th className="px-3 py-2">Dokumen</th>
                        <th className="px-3 py-2">Judul Kegiatan</th>
                        <th className="px-3 py-2">Peserta</th>
                        <th className="px-3 py-2">Tgl Kegiatan</th>
                        <th className="px-3 py-2 text-right">Anggaran</th>
                        <th className="px-3 py-2 text-center">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {paginatedData.length === 0 ? (
                        <tr>
                          <td
                            colSpan={7}
                            className="text-center py-10 text-muted-foreground"
                          >
                            No data available in table
                          </td>
                        </tr>
                      ) : (
                        paginatedData.map((item, index) => (
                          <tr key={item.id} className="border-b">
                            <td className="px-3 py-2">
                              {(page - 1) * limit + index + 1}
                            </td>
                            <td className="px-3 py-2">{item.dokumen}</td>
                            <td className="px-3 py-2">{item.judul}</td>
                            <td className="px-3 py-2">{item.peserta}</td>
                            <td className="px-3 py-2">{item.tanggal}</td>
                            <td className="px-3 py-2 text-right">
                              Rp {item.anggaran.toLocaleString("id-ID")}
                            </td>
                            <td className="px-3 py-2 text-center flex gap-1 justify-center">
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* FOOTER */}
                <div className="p-4 flex items-center justify-between text-sm">
                  <span>
                    Showing {startEntry} to {endEntry} of {filteredData.length}{" "}
                    entries
                  </span>

                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={page === 1}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      Previous
                    </Button>

                    {getPageNumbers().map((p, i) =>
                      p === "..." ? (
                        <span key={i} className="px-2">
                          ...
                        </span>
                      ) : (
                        <Button
                          key={i}
                          size="sm"
                          variant={p === page ? "default" : "outline"}
                          onClick={() => setPage(p as number)}
                        >
                          {p}
                        </Button>
                      ),
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      disabled={page === totalPages || totalPages === 0}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      {/* ================= MODAL ADD REALISASI ================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center p-4">
          <div
            className="
        bg-white rounded-2xl shadow-xl
        w-full max-w-4xl
        max-h-[85vh]
        flex flex-col
      "
          >
            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
              <h2 className="text-base font-semibold">Tambah Realisasi</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            {/* BODY (SCROLLABLE) */}
            <div className="px-6 py-4 text-sm overflow-y-auto space-y-4">
              {/* Dokumen Kerjasama */}
              <div className="space-y-1">
                <label className="font-medium text-muted-foreground">
                  Dokumen Kerjasama <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full rounded-md border px-3 py-2"
                  value={newRealisasi.dokumen}
                  onChange={(e) =>
                    setNewRealisasi({
                      ...newRealisasi,
                      dokumen: e.target.value,
                    })
                  }
                >
                  <option value="">- Pilih -</option>
                  <option value="MoU">MoU</option>
                  <option value="MoA">MoA</option>
                  <option value="IA">IA</option>
                </select>
              </div>

              {/* Bentuk Kegiatan */}
              <div className="space-y-1">
                <label className="font-medium text-muted-foreground">
                  Bentuk Kegiatan <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full rounded-md border px-3 py-2"
                  value={newRealisasi.bentuk}
                  onChange={(e) =>
                    setNewRealisasi({ ...newRealisasi, bentuk: e.target.value })
                  }
                >
                  <option value="">- Pilih -</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Seminar">Seminar</option>
                  <option value="Pelatihan">Pelatihan</option>
                  <option value="Penelitian">Penelitian</option>
                </select>
              </div>

              {/* Judul */}
              <div className="space-y-1">
                <label className="font-medium text-muted-foreground">
                  Judul Kegiatan <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  className="w-full rounded-md border px-3 py-2"
                  placeholder="judul kegiatan"
                  value={newRealisasi.judul}
                  onChange={(e) =>
                    setNewRealisasi({ ...newRealisasi, judul: e.target.value })
                  }
                />
              </div>

              {/* Tanggal */}
              <div className="space-y-1">
                <label className="font-medium text-muted-foreground">
                  Tanggal Kegiatan <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="w-full rounded-md border px-3 py-2"
                  value={newRealisasi.tanggal}
                  onChange={(e) =>
                    setNewRealisasi({
                      ...newRealisasi,
                      tanggal: e.target.value,
                    })
                  }
                />
              </div>

              {/* Anggaran */}
              <div className="space-y-1">
                <label className="font-medium text-muted-foreground">
                  Anggaran <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  className="w-full rounded-md border px-3 py-2"
                  placeholder="Rp."
                  value={newRealisasi.anggaran}
                  onChange={(e) =>
                    setNewRealisasi({
                      ...newRealisasi,
                      anggaran: e.target.value,
                    })
                  }
                />
              </div>

              {/* Jumlah Dosen */}
              <div className="space-y-1">
                <label className="font-medium text-muted-foreground">
                  Jumlah Dosen <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  className="w-full rounded-md border px-3 py-2"
                  placeholder="orang"
                  value={newRealisasi.dosen}
                  onChange={(e) =>
                    setNewRealisasi({ ...newRealisasi, dosen: e.target.value })
                  }
                />
              </div>

              {/* Jumlah Mahasiswa */}
              <div className="space-y-1">
                <label className="font-medium text-muted-foreground">
                  Jumlah Mahasiswa <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  className="w-full rounded-md border px-3 py-2"
                  placeholder="orang"
                  value={newRealisasi.mahasiswa}
                  onChange={(e) =>
                    setNewRealisasi({
                      ...newRealisasi,
                      mahasiswa: e.target.value,
                    })
                  }
                />
              </div>

              {/* Hasil */}
              <div className="space-y-1">
                <label className="font-medium text-muted-foreground">
                  Hasil Kegiatan <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  className="w-full rounded-md border px-3 py-2"
                  placeholder="hasil kegiatan"
                  value={newRealisasi.hasil}
                  onChange={(e) =>
                    setNewRealisasi({ ...newRealisasi, hasil: e.target.value })
                  }
                />
              </div>

              {/* FILE LAPORAN */}
              <div className="space-y-1">
                <label className="font-medium text-muted-foreground">
                  File Laporan
                </label>

                <div className="flex items-center border rounded-md overflow-hidden bg-background">
                  {/* BUTTON */}
                  <label
                    htmlFor="file-realisasi"
                    className="px-3 py-2 text-sm border-r bg-muted cursor-pointer hover:bg-muted/70"
                  >
                    Choose File
                  </label>

                  {/* INPUT HIDDEN */}
                  <input
                    id="file-realisasi"
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;

                      if (f.type !== "application/pdf") {
                        alert("File harus PDF");
                        return;
                      }

                      if (f.size > 5 * 1024 * 1024) {
                        alert("Ukuran maksimal 5 MB");
                        return;
                      }

                      setFileRealisasi(f);
                    }}
                  />

                  {/* FILE NAME */}
                  <div className="flex-1 px-3 py-2 text-sm truncate text-muted-foreground">
                    {fileRealisasi ? fileRealisasi.name : "No file chosen"}
                  </div>

                  {/* ACTION */}
                  {fileRealisasi && (
                    <div className="flex items-center gap-1 px-2">
                      <button
                        type="button"
                        onClick={() => setPreviewFile(fileRealisasi)}
                        className="p-1 rounded hover:bg-muted"
                        title="Lihat Dokumen"
                      >
                        <Eye className="w-4 h-4 text-primary" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setFileRealisasi(null)}
                        className="p-1 rounded hover:bg-red-50"
                        title="Hapus File"
                      >
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  )}
                </div>

                <p className="text-xs text-red-500">* file PDF maks 5 MB</p>
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-2 px-6 py-4 border-t shrink-0 bg-background">
              <Button
                variant="destructive"
                onClick={() => setShowAddModal(false)}
              >
                Close
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  console.log("DATA REALISASI:", {
                    ...newRealisasi,
                    file: fileRealisasi,
                  });
                  setShowAddModal(false);
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* PREVIEW FILE */}
      {previewFile && (
        <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl h-[80vh] flex flex-col shadow-xl">
            {/* HEADER */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="text-sm font-semibold">Preview Dokumen</h3>
              <button onClick={() => setPreviewFile(null)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* CONTENT */}
            <iframe
              src={URL.createObjectURL(previewFile)}
              className="w-full flex-1"
            />
          </div>
        </div>
      )}
    </div>
  );
}
