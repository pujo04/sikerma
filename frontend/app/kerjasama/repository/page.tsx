"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CloseButton } from "@/components/ui/close-button";
import { StatusBadge } from "@/components/status-badge";
import { ConfirmModal, SuccessModal } from "@/components/modal";
import API from "@/lib/api-config";
import {
  CheckCircle,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import {
  RefreshCcw,
  Plus,
  ArrowLeft,
  Download,
  X,
  List,
  Link as LinkIcon,
  FileText,
  FileCheck,
  FileSpreadsheet,
  Loader2,
} from "lucide-react";

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
  jenis: "MoU" | "MoA" | "IA";
  nomor: string;
  judul: string;
  expired: string;
  status: string;
  periode: string;
  deskripsi: string;
  unitPelaksana: string;
  penanggungJawab: string;
  sumberDana: string;
  anggaran: string;
  bentukKegiatan: string;
  skala: string;
  paraPenggiat: string;
  dokumen: RepositoryFile[];
  createdByUnitId?: string | null;
  createdBySubUnitId?: string | null;
};

/* ================= PAGE ================= */

export default function RepositoryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const [selectedDoc, setSelectedDoc] = useState<RepositoryDoc | null>(null);
  useEffect(() => {
    document.title = "SIKERMA - Repository";
  }, []);

  const [data, setData] = useState<RepositoryDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [userUnitId, setUserUnitId] = useState<string | null>(null);
  const [userSubUnitId, setUserSubUnitId] = useState<string | null>(null);

  /* ===== MODAL STATES ===== */
  const [klaimTarget, setKlaimTarget] = useState<RepositoryDoc | null>(null);
  const [klaimLoading, setKlaimLoading] = useState(false);
  const [successModal, setSuccessModal] = useState<{ title: string; message: string } | null>(null);
  const [errorModal, setErrorModal] = useState<{ title: string; message: string } | null>(null);

  useEffect(() => {
    const fetchRepository = async () => {
      try {
        setLoading(true);

        const res = await fetch(API.repository);
        if (!res.ok) throw new Error("Gagal fetch repository");

        const json = await res.json();
        const list = json.data ?? [];

        setData(
          list.map((r: any) => ({
            id: Number(r.id),
            jenis: r.jenisDokumen,
            nomor: r.nomorDokumen,
            judul: r.judulKerjasama,
            expired: new Date(r.tanggalBerakhir).toLocaleDateString("id-ID"),
            status: r.statusDokumen || "TidakAktif",
            periode:
              new Date(r.tanggalMulai).toLocaleDateString("id-ID") +
              " s.d " +
              new Date(r.tanggalBerakhir).toLocaleDateString("id-ID"),
            deskripsi: r.deskripsi || "-",
            unitPelaksana: r.unitPenanggungJawab,
            penanggungJawab: r.namaPenanggungJawab,
            sumberDana: r.sumberPendanaan,
            anggaran: r.jumlahAnggaran?.toString() || "0",
            skala: r.skalaKerjasama,
            bentukKegiatan: r.bentukKegiatan?.map((b: any) => b.bentuk).join(", ") || "-",
            paraPenggiat: r.penggiat?.map((p: any) =>
              `Pihak Ke-${p.pihakKe} | ${p.instansi} | ${p.namaPenandatangan}`
            ).join("\n") || "-",
            dokumen: r.dokumen ?? [], // ⬅️ PENTING
            createdByUnitId: r.createdByUnitId ?? null,
            createdBySubUnitId: r.createdBySubUnitId ?? null,
          }))
        );

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false); // 🔥 INI YANG KURANG
      }
    };

    fetchRepository();
  }, []);

  useEffect(() => {
    fetch(API.me, { credentials: "include" })
      .then((r) => r.json())
      .then((u) => {
        setUserUnitId(u.unit?.id?.toString() ?? null);
        setUserSubUnitId(u.subUnit?.id?.toString() ?? null);
      })
      .catch(() => {});
  }, []);

  /* ===== KLAIM DOKUMEN ===== */
  const isOwnDocument = (doc: RepositoryDoc) => {
    if (doc.createdByUnitId && doc.createdByUnitId === userUnitId) return true;
    if (doc.createdBySubUnitId && doc.createdBySubUnitId === userSubUnitId) return true;
    return false;
  };

  const handleKlaim = async () => {
    if (!klaimTarget) return;
    const doc = klaimTarget;

    setKlaimLoading(true);
    try {
      const res = await fetch(API.repositoryKlaim, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: doc.id }),
        credentials: "include",
      });

      if (!res.ok) throw new Error();

      setData((prev) =>
        prev.map((d) =>
          d.id === doc.id
            ? {
                ...d,
                createdByUnitId: userUnitId ?? d.createdByUnitId,
                createdBySubUnitId: userSubUnitId ?? d.createdBySubUnitId,
              }
            : d
        )
      );
      setSelectedDoc(null);
      setKlaimTarget(null);
      setSuccessModal({
        title: "Berhasil",
        message: `Dokumen "${doc.judul}" berhasil diklaim ke unit Anda.`,
      });
    } catch {
      setKlaimTarget(null);
      setErrorModal({
        title: "Gagal",
        message: "Gagal klaim dokumen. Silakan coba lagi.",
      });
    } finally {
      setKlaimLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      `${item.jenis} ${item.nomor} ${item.judul} ${item.status}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [data, search]);

  const totalPages = Math.ceil(filteredData.length / limit);

  const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

  useEffect(() => {
    setPage(1);
  }, [search, limit]);

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    return [1, 2, 3, "...", totalPages];
  };

  const DOKUMEN_META: Record<
    string,
    { label: string; icon: any }
  > = {
    utama: {
      label: "File Dokumen",
      icon: Download,
    },
    kontrak: {
      label: "Kontrak",
      icon: FileCheck,
    },
    kak: {
      label: "KAK",
      icon: FileText,
    },
    rab: {
      label: "RAB",
      icon: FileSpreadsheet,
    },
    link: {
      label: "Link Dokumen",
      icon: LinkIcon,
    },
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
                  Repository Dokumen
                </h1>

                <div className="flex gap-2">
                  <Link href="/kerjasama/repository/create">
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </Link>
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
                      placeholder="Cari dokumen..."
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
                        <th className="px-3 py-2 text-center">Expired Date</th>
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
                          <tr key={item.id} className="border-b">
                            <td className="px-3 py-2 text-center">
                              {(page - 1) * limit + index + 1}
                            </td>
                            <td className="px-3 py-2 text-center">{item.jenis}</td>
                            <td className="px-3 py-2 text-center">{item.nomor}</td>
                            <td className="px-3 py-2 text-center">{item.judul}</td>
                            <td className="px-3 py-2 text-center">{item.expired}</td>
                            <td className="px-3 py-2 text-center">
                              <StatusBadge status={item.status} />
                            </td>
                            <td className="px-3 py-2 flex gap-1 justify-center">
                              {/* DETAIL */}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedDoc(item)}
                              >
                                <List className="w-4 h-4" />
                              </Button>
                              {/* DOWNLOAD */}
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={!item.dokumen?.length}
                                onClick={() => {
                                  const file = item.dokumen[0]; // default ambil file utama
                                  if (!file?.filePath) return;

                                  window.open(file.filePath, "_blank");
                                }}
                              >
                                <Download className="w-4 h-4" />
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
                    Showing {(page - 1) * limit + 1} to{" "}
                    {Math.min(page * limit, filteredData.length)} of{" "}
                    {filteredData.length} entries
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
      </div>

      {/* ================= KLAIM CONFIRM MODAL ================= */}
      <ConfirmModal
        open={!!klaimTarget}
        onClose={() => setKlaimTarget(null)}
        onConfirm={handleKlaim}
        title="Klaim Dokumen"
        message={`Apakah Anda yakin ingin mengklaim dokumen "${klaimTarget?.judul}" ke unit kerja Anda?`}
        confirmText={klaimLoading ? "Mengklaim..." : "Klaim"}
        cancelText="Batal"
        confirmIcon={<ShieldCheck className="w-10 h-10 text-blue-500" />}
      />

      {/* ================= SUCCESS MODAL ================= */}
      {successModal && (
        <SuccessModal
          open={!!successModal}
          onClose={() => setSuccessModal(null)}
          title={successModal.title}
          message={successModal.message}
          icon={<CheckCircle className="w-10 h-10 text-green-500" />}
          autoClose={2500}
        />
      )}

      {/* ================= ERROR MODAL ================= */}
      {errorModal && (
        <SuccessModal
          open={!!errorModal}
          onClose={() => setErrorModal(null)}
          title={errorModal.title}
          message={errorModal.message}
          icon={<AlertCircle className="w-10 h-10 text-red-500" />}
          autoClose={3000}
        />
      )}

      {/* ================= MODAL DETAIL ================= */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div
            className="
        bg-white rounded-xl shadow-xl
        w-full max-w-2xl
        max-h-[80vh]
        flex flex-col
      "
          >
            {/* HEADER (fixed) */}
            <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
              <h2 className="text-base font-semibold text-foreground">
                Detail Dokumen Kerjasama
              </h2>
            <CloseButton onClick={() => setSelectedDoc(null)} />
            </div>

            {/* BODY (scrollable) */}
            <div className="px-6 py-4 text-sm space-y-3 overflow-y-auto">
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
                ["Para Penggiat", selectedDoc.paraPenggiat], // ⬅️ TAMBAHAN
                ["Skala", selectedDoc.skala],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="grid grid-cols-[170px_1fr] gap-4 py-2 border-b border-muted"
                >
                  <span className="text-muted-foreground">{label}</span>
                  <span className="text-foreground leading-relaxed whitespace-pre-line">
                    {value}
                  </span>
                </div>
              ))}

              {/* DOWNLOAD */}
              <div className="grid grid-cols-[170px_1fr] gap-4 py-4 border-b border-muted">
                <span className="text-muted-foreground">Download File</span>

                <div className="flex flex-wrap gap-2">
                  {selectedDoc.dokumen.length === 0 && (
                    <span className="text-sm text-muted-foreground">
                      Tidak ada dokumen
                    </span>
                  )}

                  {selectedDoc.dokumen.map((doc) => {
                    // ===============================
                    // 1️⃣ DOKUMEN UTAMA
                    // ===============================
                    if (doc.jenis === "utama") {
                      // Kalau ada file → tampilkan file
                      if (doc.filePath) {
                        return (
                          <Button
                            key={doc.id}
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(doc.filePath!, "_blank")}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            File Dokumen
                          </Button>
                        );
                      }

                      // Kalau tidak ada file tapi ada link → tampilkan link
                      if (!doc.filePath && doc.linkUrl) {
                        return (
                          <Button
                            key={doc.id}
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(doc.linkUrl!, "_blank")}
                          >
                            <LinkIcon className="w-4 h-4 mr-1" />
                            Link Dokumen
                          </Button>
                        );
                      }

                      return null;
                    }

                    // ===============================
                    // 2️⃣ DOKUMEN PENDUKUNG (FILE SAJA)
                    // ===============================
                    if (!doc.filePath) return null;

                    if (doc.jenis === "kontrak") {
                      return (
                        <Button
                          key={doc.id}
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(doc.filePath!, "_blank")}
                        >
                          <FileCheck className="w-4 h-4 mr-1" />
                          Kontrak
                        </Button>
                      );
                    }

                    if (doc.jenis === "kak") {
                      return (
                        <Button
                          key={doc.id}
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(doc.filePath!, "_blank")}
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          KAK
                        </Button>
                      );
                    }

                    if (doc.jenis === "rab") {
                      return (
                        <Button
                          key={doc.id}
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(doc.filePath!, "_blank")}
                        >
                          <FileSpreadsheet className="w-4 h-4 mr-1" />
                          RAB
                        </Button>
                      );
                    }

                    return null;
                  })}
                </div>
              </div>

              {/* ACTION */}
              <div className="flex justify-center pt-6">
                {!isOwnDocument(selectedDoc) && (
                  <Button
                    variant="secondary"
                    className="px-6"
                    onClick={() => {
                      setSelectedDoc(null);
                      setKlaimTarget(selectedDoc);
                    }}
                  >
                    Klaim Dokumen Ini?
                  </Button>
                )}
                {isOwnDocument(selectedDoc) && (
                  <span className="text-sm text-muted-foreground">
                    Dokumen ini milik unit Anda
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
