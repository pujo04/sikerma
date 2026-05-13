"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CloseButton } from "@/components/ui/close-button";
import { StatusBadge } from "@/components/status-badge";
import { Download, List, Trash2, Pencil, Plus, Loader2 } from "lucide-react";
import API from "@/lib/api-config";

/* ================= TYPES ================= */

type RepositoryFile = {
  id: number;
  jenis: string;
  fileName?: string;
  filePath?: string;
  linkUrl?: string;
};

type RepositoryDoc = {
  id: number;
  jenis: "MOU" | "MOA" | "IA";
  nomor: string;
  judul: string;
  tglMulai: string;
  status: string;
  dokumen?: RepositoryFile[];
  periode?: string;
  deskripsi?: string;
  unitPelaksana?: string;
  penanggungJawab?: string;
  sumberDana?: string;
  anggaran?: string;
  bentukKegiatan?: string;
  paraPenggiat?: string;
  skala?: string;
  // 🔥 INFO KLAIM
  originalUnitId?: string | null;
  originalSubUnitId?: string | null;
};

/* ================= PAGE ================= */

export default function MyRepositoryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const [data, setData] = useState<RepositoryDoc[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedDoc, setSelectedDoc] = useState<RepositoryDoc | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [lastDeleteWasClaimed, setLastDeleteWasClaimed] = useState(false);

  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  useEffect(() => {
    document.title = "SIKERMA - My Repository";
  }, []);

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    const fetchMyRepository = async () => {
      try {
        setLoading(true);
        const res = await fetch(API.repositoryMydata, {
          credentials: "include",
        });

        if (!res.ok) {
          setData([]);
          return;
        }

        const text = await res.text();
        if (!text) {
          setData([]);
          return;
        }

        const list = JSON.parse(text);

        setData(
          list.map((r: any) => ({
            id: Number(r.id),
            jenis: r.jenisDokumen,
            nomor: r.nomorDokumen,
            judul: r.judulKerjasama,
            tglMulai: new Date(r.tanggalMulai).toLocaleDateString("id-ID"),
            status: r.statusDokumen || "TidakAktif",
            dokumen: r.dokumen ?? [],
            originalUnitId: r.originalUnitId ?? null,
            originalSubUnitId: r.originalSubUnitId ?? null,
            periode:
              new Date(r.tanggalMulai).toLocaleDateString("id-ID") +
              " s.d " +
              new Date(r.tanggalBerakhir).toLocaleDateString("id-ID"),
            deskripsi: r.deskripsi,
            unitPelaksana: r.unitPenanggungJawab,
            penanggungJawab: r.namaPenanggungJawab,
            sumberDana: r.sumberPendanaan,
            anggaran: r.jumlahAnggaran ? r.jumlahAnggaran.toString() : "-",
            skala: r.skalaKerjasama,
            bentukKegiatan: r.bentukKegiatan?.length
              ? r.bentukKegiatan.map((b: any) => b.bentuk).join(", ")
              : "-",
            paraPenggiat: r.penggiat?.length
              ? r.penggiat
                  .map(
                    (p: any) =>
                      `Pihak Ke-${p.pihakKe} | ${p.instansi} | ${p.namaPenandatangan}`,
                  )
                  .join("\n")
              : "-",
          })),
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyRepository();
  }, []);

  /* ================= FILTER & PAGINATION ================= */

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      `${item.jenis} ${item.nomor} ${item.judul} ${item.status}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [search, data]);

  const totalPages = Math.ceil(filteredData.length / limit);

  const paginatedData = filteredData.slice(
    (page - 1) * limit,
    page * limit,
  );

  useEffect(() => {
    setPage(1);
  }, [search, limit]);

  /* ================= HANDLERS ================= */

  const handleDownload = (doc: RepositoryDoc) => {
    const utama = doc.dokumen?.find((d) => d.jenis === "utama");
    if (!utama) return;

    if (utama.filePath) {
      window.open(utama.filePath, "_blank");
    } else if (utama.linkUrl) {
      window.open(utama.linkUrl, "_blank");
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const handleDeleteRepository = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(API.repositoryDetail(deleteId.toString()), {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Gagal hapus");

      const json = await res.json();

      // Jika dokumen diklaim → hapus permanen dari My Data unit penuntut
      // Jika dokumen asli → hapus permanen juga
      setLastDeleteWasClaimed(!!json.isClaimed);
      setData((prev) => prev.filter((item) => item.id !== deleteId));
      setShowDeleteConfirm(false);
      setShowDeleteSuccess(true);

      setTimeout(() => {
        setShowDeleteSuccess(false);
        setDeleteId(null);
        setLastDeleteWasClaimed(false);
      }, 2500);
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus repository");
    }
  };

  /* ================= RENDER ================= */

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
          sidebarExpanded ? "md:ml-64" : "md:ml-[72px]",
        )}
      >
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* HEADER */}
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold">My Repository</h1>

              <Link href="/kerjasama/repository/create">
                <Button size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </Link>
            </div>

            {/* TABLE CARD */}
            <div className="rounded-lg border bg-card">
              {/* CONTROLS */}
              <div className="flex items-center justify-between p-4 text-sm">
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
                  />
                </div>
              </div>

              {/* TABLE */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-t">
                  <thead className="bg-muted/40">
                    <tr>
                      <th className="px-3 py-2 text-center">No</th>
                      <th className="px-3 py-2 text-center">Jenis</th>
                      <th className="px-3 py-2 text-center">Nomor Dokumen</th>
                      <th className="px-3 py-2 text-center">Judul Kegiatan</th>
                      <th className="px-3 py-2 text-center">Tgl. Mulai</th>
                      <th className="px-3 py-2 text-center">Status</th>
                      <th className="px-3 py-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="py-10 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground">Memuat data...</p>
                          </div>
                        </td>
                      </tr>
                    ) : paginatedData.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-6 text-center text-muted-foreground">
                          Tidak ada data
                        </td>
                      </tr>
                    ) : (
                      paginatedData.map((item, index) => (
                        <tr key={item.id} className="border-b hover:bg-muted/40">
                          <td className="px-3 py-2 text-center">
                            {(page - 1) * limit + index + 1}
                          </td>
                          <td className="px-3 py-2 text-center">{item.jenis}</td>
                          <td className="px-3 py-2 text-center">{item.nomor}</td>
                          <td className="px-3 py-2 max-w-xl">{item.judul}</td>
                          <td className="px-3 py-2 text-center">{item.tglMulai}</td>
                          <td className="px-3 py-2 text-center">
                            <StatusBadge status={item.status} />
                            {item.originalUnitId || item.originalSubUnitId ? (
                              <span className="ml-1 inline-block px-1.5 py-0.5 text-xs rounded bg-blue-100 text-blue-700 border border-blue-300">
                                Diklaim
                              </span>
                            ) : null}
                          </td>
                          <td className="px-3 py-2 text-center">
                            <div className="flex justify-center gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={!item.dokumen?.some((d) => d.jenis === "utama")}
                                onClick={() => handleDownload(item)}
                              >
                                <Download className="w-4 h-4" />
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedDoc(item)}
                              >
                                <List className="w-4 h-4" />
                              </Button>

                              <Link href={`/kerjasama/repository/edit/${item.id}`}>
                                <Button size="sm" variant="outline">
                                  <Pencil className="w-4 h-4" />
                                </Button>
                              </Link>

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteClick(item.id)}
                                className="group border-red-200 hover:bg-red-600 hover:border-red-600 transition-colors"
                              >
                                <Trash2 className="w-4 h-4 text-black group-hover:text-white" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* FOOTER */}
              <div className="p-4 flex justify-between text-sm">
                <span>
                  Showing {(page - 1) * limit + 1} to{" "}
                  {Math.min(page * limit, filteredData.length)} of{" "}
                  {filteredData.length} entries
                </span>

                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Previous
                  </Button>
                  <Button size="sm" variant="default">
                    {page}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page === totalPages}
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

      {/* MODAL DETAIL */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="flex justify-between px-6 py-4 border-b">
              <h2 className="font-semibold">Detail Dokumen Kerjasama</h2>
              <CloseButton onClick={() => setSelectedDoc(null)} />
            </div>

            <div className="px-6 py-4 space-y-3 overflow-y-auto text-sm">
              {[
                ["Jenis Dokumen", selectedDoc.jenis],
                ["Nomor Dokumen", selectedDoc.nomor],
                ["Judul Kerjasama", selectedDoc.judul],
                ["Status Dokumen", selectedDoc.status],
                ["Periode", selectedDoc.periode],
                ["Deskripsi", selectedDoc.deskripsi],
                ["Unit Pelaksana", selectedDoc.unitPelaksana],
                ["Penanggung Jawab", selectedDoc.penanggungJawab],
                ["Sumber Dana", selectedDoc.sumberDana],
                ["Anggaran", selectedDoc.anggaran],
                ["Bentuk Kegiatan", selectedDoc.bentukKegiatan],
                ["Para Penggiat", selectedDoc.paraPenggiat],
                ["Skala", selectedDoc.skala],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="grid grid-cols-[170px_1fr] gap-4 border-b py-2"
                >
                  <span className="text-muted-foreground">{label}</span>
                  <span className="whitespace-pre-line">{value || "-"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {showDeleteConfirm && deleteId !== null && (() => {
        const doc = data.find((d) => d.id === deleteId);
        const isClaimed = doc?.originalUnitId !== null || doc?.originalSubUnitId !== null;
        return (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm text-center space-y-4 shadow-lg">
              <div className="flex justify-center">
                <Trash2 className="w-10 h-10 text-red-600" />
              </div>

              <p className="text-base font-medium text-red-600">
                {isClaimed ? "Hapus Dokumen?" : "Hapus Repository?"}
              </p>

              <p className="text-sm text-muted-foreground">
                {isClaimed
                  ? "Dokumen ini adalah hasil klaim. Dokumen akan dihapus permanen dari My Data Anda."
                  : "Apakah kamu yakin ingin menghapus dokumen ini? Tindakan ini tidak dapat dibatalkan."}
              </p>

              <div className="flex justify-center gap-2">
                <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                  Batal
                </Button>
                <Button variant="destructive" onClick={handleDeleteRepository}>
                  Ya, Hapus
                </Button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* DELETE SUCCESS MODAL */}
      {showDeleteSuccess && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm text-center space-y-4 shadow-lg">
            <div className="flex justify-center">
              <Trash2 className="w-10 h-10 text-green-600" />
            </div>

            <p className="text-base font-medium text-green-600">Berhasil</p>

            <p className="text-sm text-muted-foreground">
              {lastDeleteWasClaimed
                ? "Dokumen berhasil dihapus dari My Data"
                : "Repository berhasil dihapus"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
