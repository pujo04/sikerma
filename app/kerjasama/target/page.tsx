"use client";

import { useState, useMemo, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Plus, ArrowLeft, Pencil, Trash2 } from "lucide-react";

/* ================= TYPES ================= */

type TargetKerjasama = {
  id: number;
  tahun: number;
  mou: number;
  moa: number;
  ia: number;
  aktif: number;
  perpanjangan: number;
  kadaluarsa: number;
  tidakAktif: number;
  status: "Open" | "Close";
};

/* ================= DUMMY DATA ================= */

const DUMMY_TARGET: TargetKerjasama[] = [
  {
    id: 1,
    tahun: 2023,
    mou: 0,
    moa: 0,
    ia: 0,
    aktif: 0,
    perpanjangan: 0,
    kadaluarsa: 0,
    tidakAktif: 0,
    status: "Open",
  },
  {
    id: 2,
    tahun: 2022,
    mou: 0,
    moa: 0,
    ia: 0,
    aktif: 0,
    perpanjangan: 0,
    kadaluarsa: 0,
    tidakAktif: 0,
    status: "Close",
  },
  {
    id: 3,
    tahun: 2021,
    mou: 0,
    moa: 0,
    ia: 0,
    aktif: 0,
    perpanjangan: 0,
    kadaluarsa: 0,
    tidakAktif: 0,
    status: "Close",
  },
];

/* ================= PAGE ================= */

export default function TargetKerjasamaPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
useEffect(() => {
  document.title = "SIKERMA - Target Kerjasama";
}, []);
  /* ================= FILTER ================= */

  const filteredData = useMemo(() => {
    return DUMMY_TARGET.filter((item) =>
      `${item.tahun} ${item.status}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [search]);

  /* ================= PAGINATION ================= */
  const [showModal, setShowModal] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<TargetKerjasama | null>(
    null,
  );

  const totalPages = Math.ceil(filteredData.length / limit);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState<null | "add" | "edit">(null);

  const [newTarget, setNewTarget] = useState<
    Omit<TargetKerjasama, "id" | "status">
  >({
    tahun: 0,
    mou: 0,
    moa: 0,
    ia: 0,
    aktif: 0,
    perpanjangan: 0,
    kadaluarsa: 0,
    tidakAktif: 0,
  });

  const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    return [1, 2, 3, "...", totalPages];
  };

  const startEntry = filteredData.length === 0 ? 0 : (page - 1) * limit + 1;

  const endEntry = Math.min(page * limit, filteredData.length);

  const handleEdit = (item: TargetKerjasama) => {
    setSelectedTarget(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTarget(null);
  };

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal]);

  useEffect(() => {
    if (showSuccess) {
      const t = setTimeout(() => setShowSuccess(null), 2000);
      return () => clearTimeout(t);
    }
  }, [showSuccess]);

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
                  Target Kerjasama
                </h1>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddModal(true)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>

              {/* INFO */}
              <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                <strong>Informasi!</strong> Target kerjasama diisi setiap tahun
                dan dapat diubah sebelum data terkirim. Pastikan mengisi target
                kerjasama sesuai dengan rencana kinerja kerjasama di unit
                masing-masing.
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
                      placeholder="Cari tahun / status..."
                    />
                  </div>
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-t">
                    <thead className="bg-muted/40">
                      <tr>
                        <th rowSpan={2} className="px-3 py-2">
                          No
                        </th>
                        <th rowSpan={2} className="px-3 py-2">
                          Tahun
                        </th>
                        <th colSpan={3} className="px-3 py-2 text-center">
                          Jenis Kerjasama
                        </th>
                        <th colSpan={4} className="px-3 py-2 text-center">
                          Status Kerjasama
                        </th>
                        <th rowSpan={2} className="px-3 py-2">
                          Status
                        </th>
                        <th rowSpan={2} className="px-3 py-2 text-center">
                          Action
                        </th>
                      </tr>
                      <tr>
                        <th className="px-3 py-2">MoU</th>
                        <th className="px-3 py-2">MoA</th>
                        <th className="px-3 py-2">IA</th>
                        <th className="px-3 py-2">Aktif</th>
                        <th className="px-3 py-2">Perpanjangan</th>
                        <th className="px-3 py-2">Kadaluarsa</th>
                        <th className="px-3 py-2">Tidak Aktif</th>
                      </tr>
                    </thead>

                    <tbody>
                      {paginatedData.length === 0 ? (
                        <tr>
                          <td
                            colSpan={12}
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
                            <td className="px-3 py-2">{item.tahun}</td>
                            <td className="px-3 py-2 text-center">
                              {item.mou}
                            </td>
                            <td className="px-3 py-2 text-center">
                              {item.moa}
                            </td>
                            <td className="px-3 py-2 text-center">{item.ia}</td>
                            <td className="px-3 py-2 text-center">
                              {item.aktif}
                            </td>
                            <td className="px-3 py-2 text-center">
                              {item.perpanjangan}
                            </td>
                            <td className="px-3 py-2 text-center">
                              {item.kadaluarsa}
                            </td>
                            <td className="px-3 py-2 text-center">
                              {item.tidakAktif}
                            </td>
                            <td className="px-3 py-2">{item.status}</td>
                            <td className="px-3 py-2 text-center flex gap-1 justify-center">
                              {item.status === "Open" ? (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEdit(item)}
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </Button>

                                  <Button size="sm" variant="destructive">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </>
                              ) : (
                                <span className="text-green-600 text-xs font-medium">
                                  Terkirim
                                </span>
                              )}
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
                    {/* Previous */}
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={page === 1}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      Previous
                    </Button>

                    {/* Page Numbers */}
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

                    {/* Next */}
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

      {/* ================= MODAL ADD TARGET ================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center p-4">
          <div
            className="
        bg-white rounded-2xl shadow-xl
        w-full max-w-4xl
        max-h-[80vh]
        flex flex-col
      "
          >
            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
              <h2 className="text-base font-semibold">Buat Target Tahunan</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            {/* BODY */}
            <div className="px-6 py-4 text-sm overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  ["Target Tahun", "tahun", "tahun"],
                  ["Jumlah MoU", "mou", "jumlah MoU"],
                  ["Jumlah MoA", "moa", "jumlah MoA"],
                  ["Jumlah IA", "ia", "jumlah IA"],
                  ["Dokumen Aktif", "aktif", "jumlah dokumen aktif"],
                  [
                    "Dok. Kadaluarsa",
                    "kadaluarsa",
                    "jumlah dokumen kadaluarsa",
                  ],
                  [
                    "Dok. Perpanjangan",
                    "perpanjangan",
                    "jumlah dokumen perpanjangan",
                  ],
                  [
                    "Dok. Tidak Aktif",
                    "tidakAktif",
                    "jumlah dokumen tidak aktif",
                  ],
                ].map(([label, key, placeholder]) => (
                  <div key={key} className="space-y-1">
                    <label className="font-medium text-muted-foreground">
                      {label} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      placeholder={placeholder}
                      value={(newTarget as any)[key]}
                      onChange={(e) =>
                        setNewTarget((prev) => ({
                          ...prev,
                          [key]: Number(e.target.value),
                        }))
                      }
                      className="
                  w-full rounded-md border px-3 py-2
                  focus:outline-none focus:ring-2
                  focus:ring-primary/40
                "
                    />
                  </div>
                ))}
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
                  console.log("ADD TARGET:", newTarget);
                  setShowAddModal(false);
                  setShowSuccess("add");
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL EDIT TARGET ================= */}
      {showModal && selectedTarget && (
        <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center p-4">
          <div
            className="
        bg-white rounded-2xl shadow-xl
        w-full max-w-4xl
        max-h-[80vh]
        flex flex-col
      "
          >
            {/* HEADER (FIXED) */}
            <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
              <h2 className="text-base font-semibold text-foreground">
                Edit Target Tahunan
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            {/* BODY (SCROLLABLE) */}
            <div className="px-6 py-4 text-sm overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  ["Target Tahun", "tahun"],
                  ["Jumlah MoU", "mou"],
                  ["Jumlah MoA", "moa"],
                  ["Jumlah IA", "ia"],
                  ["Dokumen Aktif", "aktif"],
                  ["Dok. Kadaluarsa", "kadaluarsa"],
                  ["Dok. Perpanjangan", "perpanjangan"],
                  ["Dok. Tidak Aktif", "tidakAktif"],
                ].map(([label, key]) => (
                  <div key={key} className="space-y-1">
                    <label className="font-medium text-muted-foreground">
                      {label} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={(selectedTarget as any)[key]}
                      onChange={(e) =>
                        setSelectedTarget((prev) =>
                          prev
                            ? { ...prev, [key]: Number(e.target.value) }
                            : prev,
                        )
                      }
                      className="
                  w-full rounded-md border px-3 py-2
                  focus:outline-none focus:ring-2
                  focus:ring-primary/40
                "
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* FOOTER (FIXED) */}
            <div className="flex justify-end gap-2 px-6 py-4 border-t shrink-0 bg-background">
              <Button variant="destructive" onClick={handleCloseModal}>
                Close
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  console.log("SAVE DATA:", selectedTarget);
                  handleCloseModal();
                  setShowSuccess("edit");
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ================= SUCCESS MODAL ================= */}
      {showSuccess && (
        <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm text-center">
            <div className="px-6 py-6 space-y-4">
              <div className="text-green-600 text-4xl">✔</div>

              <h3 className="text-base font-semibold">Berhasil</h3>

              <p className="text-sm text-muted-foreground">
                {showSuccess === "add"
                  ? "Data target kerjasama berhasil ditambahkan."
                  : "Data target kerjasama berhasil diperbarui."}
              </p>

              <Button
                variant="default"
                className="w-full"
                onClick={() => setShowSuccess(null)}
              >
                OK
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
