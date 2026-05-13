"use client";

import { useState, useMemo, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ErrorModal } from "@/components/modal";
import { Input, DeleteConfirmModal, FileInput, StatusBadge, PreviewModal } from "@/components/pencairan-form-shell";
import API from "@/lib/api-config";
import {
  Plus,
  Pencil,
  Trash2,
  CheckCircle,
  X,
  Eye
} from "lucide-react";

/* ================= TYPES ================= */

type PencairanDana = {
  id: string;
  dasarDokumen: string;
  danaMitra: string;
  jumlah: string;
  tanggal: string;
  catatan: string;
  status: "Draft" | "Diajukan" | "Disetujui" | "Ditolak";
};


/* ================= PAGE ================= */

export default function PencairanDanaPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [editId, setEditId] = useState<string | null>(null);
  const isEdit = editId !== null;

  useEffect(() => {
    document.title = "SIKERMA - Pencairan Dana";
  }, []);


  /* ================= DATA ================= */
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pencairanData, setPencairanData] = useState<PencairanDana[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddSuccess, setShowAddSuccess] = useState(false);
  const [showEditSuccess, setShowEditSuccess] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [errorModal, setErrorModal] = useState<string | null>(null);

  const [newPencairan, setNewPencairan] = useState({
    dasarDokumen: "",
    jumlah: "",
    penanggungjawab: "",
    tanggalTransfer: "",
    noSurat: "",
    tanggalSurat: "",
    suratPengajuan: null as File | null,
    buktiTransfer: null as File | null,
    bukuRekening: null as File | null,
    rab: null as File | null,
    sptjm: null as File | null,
    laporanKegiatan: null as File | null,
  });

  /* ================= FILTER ================= */

  const filteredData = useMemo(() => {
    const keyword = search.toLowerCase();

    if (!Array.isArray(pencairanData)) return [];

    return pencairanData.filter((item) =>
      `${item.dasarDokumen} ${item.danaMitra} ${item.status} ${item.catatan ?? ""}`
        .toLowerCase()
        .includes(keyword)
    );
  }, [search, pencairanData]);


  const fetchData = async () => {
    const res = await fetch(
      `${API.pencairan}?search=${search}&page=1&limit=${limit}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      console.error(await res.text());
      return;
    }

    const json = await res.json();
    setPencairanData(Array.isArray(json.data) ? json.data : []);
  };

  useEffect(() => {
    fetchData();
  }, [search, limit]);

  /* ================= PAGINATION ================= */

  const totalPages = Math.ceil(filteredData.length / limit);

  const paginatedData = filteredData.slice(
    (page - 1) * limit,
    page * limit
  );

  useEffect(() => {
    setPage(1);
  }, [search, limit]);

  const startEntry =
    filteredData.length === 0 ? 0 : (page - 1) * limit + 1;
  const endEntry = Math.min(page * limit, filteredData.length);

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    return [1, 2, 3, "...", totalPages];
  };

  const validateForm = () => {

    // ================= EDIT MODE =================
    if (isEdit) {

      setErrors({});
      return true;

    }

    // ================= ADD MODE =================

    const newErrors: Record<string, string> = {};

    if (!newPencairan.dasarDokumen.trim())
      newErrors.dasarDokumen = "Dasar dokumen wajib diisi";

    if (!newPencairan.jumlah || Number(newPencairan.jumlah) <= 0)
      newErrors.jumlah = "Jumlah wajib diisi dan > 0";

    if (!newPencairan.penanggungjawab.trim())
      newErrors.penanggungjawab = "Penanggungjawab wajib diisi";

    if (!newPencairan.tanggalTransfer)
      newErrors.tanggalTransfer = "Tanggal transfer wajib diisi";

    if (!newPencairan.noSurat.trim())
      newErrors.noSurat = "Nomor surat wajib diisi";

    if (!newPencairan.tanggalSurat)
      newErrors.tanggalSurat = "Tanggal surat wajib diisi";

    if (!newPencairan.suratPengajuan)
      newErrors.suratPengajuan = "Surat pengajuan wajib upload";

    if (!newPencairan.buktiTransfer)
      newErrors.buktiTransfer = "Bukti transfer wajib upload";

    if (!newPencairan.bukuRekening)
      newErrors.bukuRekening = "Buku rekening wajib upload";

    if (!newPencairan.rab)
      newErrors.rab = "RAB wajib upload";

    if (!newPencairan.sptjm)
      newErrors.sptjm = "SPTJM wajib upload";

    if (!newPencairan.laporanKegiatan)
      newErrors.laporanKegiatan = "Laporan wajib upload";


    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleDelete = async () => {
    const id = confirmDeleteId;
    if (!id) return;
    setConfirmDeleteId(null);

    // Optimistic update
    setPencairanData((prev) => prev.filter((p) => p.id !== id));

    const res = await fetch(API.pencairanDetail(id), { method: "DELETE" });
    if (!res.ok) {
      setErrorModal("Gagal menghapus data. Silakan coba lagi.");
      fetchData();
    }
  };

  const handleSavePencairan = async () => {
    if (!validateForm()) return;

    // ================= BUILD OPTIMISTIC ITEM =================
    const optimisticItem: PencairanDana = {
      id: editId ?? `temp_${Date.now()}`,
      dasarDokumen: newPencairan.dasarDokumen,
      danaMitra: newPencairan.penanggungjawab,
      jumlah: newPencairan.jumlah,
      tanggal: newPencairan.tanggalTransfer,
      catatan: newPencairan.noSurat,
      status: "Draft",
    };

    // ================= CLOSE MODAL + TOAST IMMEDIATELY =================
    setShowAddModal(false);
    setEditId(null);
    setShowAddSuccess(true);

    // Optimistic update — update/add ke state langsung
    if (editId) {
      setPencairanData((prev) => prev.map((p) => p.id === editId ? { ...p, ...optimisticItem } : p));
    } else {
      setPencairanData((prev) => [optimisticItem, ...prev]);
    }

    // ================= API SAVE + FILE UPLOADS IN BACKGROUND =================
    const doSave = async () => {
      try {
        let pencairanId = editId ?? "";

        if (!editId) {
          const res = await fetch(API.pencairan, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              dasarDokumen: newPencairan.dasarDokumen,
              danaMitra: newPencairan.penanggungjawab,
              jumlah: Number(newPencairan.jumlah),
              tanggal: newPencairan.tanggalTransfer,
              catatan: newPencairan.noSurat,
            }),
          });
          const data = await res.json();
          if (res.ok) pencairanId = data.id;
        } else {
          await fetch(API.pencairanDetail(editId), {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              dasarDokumen: newPencairan.dasarDokumen,
              danaMitra: newPencairan.penanggungjawab,
              jumlah: Number(newPencairan.jumlah),
              tanggal: newPencairan.tanggalTransfer,
              catatan: newPencairan.noSurat,
            }),
          });
        }

        // ================= UPLOAD FILE (NO AWAIT) =================
        const files = [
          { key: "suratPengajuan", file: newPencairan.suratPengajuan },
          { key: "buktiTransfer", file: newPencairan.buktiTransfer },
          { key: "bukuRekening", file: newPencairan.bukuRekening },
          { key: "rab", file: newPencairan.rab },
          { key: "sptjm", file: newPencairan.sptjm },
          { key: "laporanKegiatan", file: newPencairan.laporanKegiatan },
        ];

        for (const item of files) {
          if (!item.file || !pencairanId) continue;
          const fd = new FormData();
          fd.append("file", item.file);
          fd.append("pencairanId", pencairanId);
          fd.append("jenisDokumen", item.key);
          fetch(API.pencairanUpload, { method: "POST", body: fd });
        }

        fetchData(); // background data refresh
      } catch (err) {
        console.error("Save error:", err);
      }
    };

    doSave(); // fire and forget

    // ✅ AUTO CLOSE SUCCESS TOAST
    setTimeout(() => {
      setShowAddSuccess(false);
      setShowEditSuccess(false);
      setSearch("");
      setPage(1);
    }, 2000);
  };

  /* ================= UI ================ */

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
          sidebarExpanded ? "md:ml-64" : "md:ml-[72px]"
        )}
      >
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* TITLE */}
            <div className="flex items-center justify-between">
              <h1 className="text-xl md:text-2xl font-bold">
                Pencairan Dana
              </h1>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddModal(true)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Buat Ajuan
                </Button>
              </div>
            </div>

            {/* TABLE */}
            <div className="rounded-lg border bg-card">
              <div className="p-4 flex justify-between text-sm">
                <div>
                  Show{" "}
                  <select
                    value={limit}
                    onChange={(e) => setLimit(Number(e.target.value))}
                    className="border rounded px-2 py-1 mx-1"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                  entries
                </div>

                <div>
                  Search:{" "}
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border rounded px-2 py-1"
                  />
                </div>
              </div>

              <table className="w-full text-sm border-t">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="px-3 py-2 text-center">No</th>
                    <th className="px-3 py-2 text-center">Dasar Dokumen</th>
                    <th className="px-3 py-2 text-center">Dana Mitra</th>
                    <th className="px-3 py-2 text-center">Jumlah</th>
                    <th className="px-3 py-2 text-center">Tanggal</th>
                    <th className="px-3 py-2 text-center">Catatan</th>
                    <th className="px-3 py-2 text-center">Status</th>
                    <th className="px-3 py-2 text-center">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-10 text-center text-muted-foreground"
                      >
                        No data available in table
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((item, i) => (
                      <tr key={item.id} className="border-b">
                        <td className="px-3 py-2 text-center">
                          {(page - 1) * limit + i + 1}
                        </td>
                        <td className="px-3 py-2 text-center">
                          {item.dasarDokumen}
                        </td>
                        <td className="px-3 py-2 text-center">
                          {item.danaMitra}
                        </td>
                        <td className="px-3 py-2 text-center">
                          Rp {Number(item.jumlah).toLocaleString("id-ID")}
                        </td>
                        <td className="px-3 py-2 text-center">
                          {new Date(item.tanggal).toLocaleDateString("id-ID")}
                        </td>
                        <td className="px-3 py-2 text-center">
                          {item.catatan}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <StatusBadge status={item.status} />
                        </td>
                        <td className="px-3 py-2 text-center flex gap-1 justify-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDetailId(item.id)}
                            className="
                              group
                              border-blue-200
                              hover:bg-blue-600 hover:border-blue-600
                              transition-colors
                            "
                          >
                            <Eye
                              className="
                                w-4 h-4
                                text-black
                                group-hover:text-white
                              "
                            />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={async () => {

                              const res = await fetch(API.pencairanDetail(item.id));

                              const data = await res.json();

                              setEditId(item.id);

                              setNewPencairan({
                                dasarDokumen: data.dasarDokumen,
                                jumlah: data.jumlah,
                                penanggungjawab: data.danaMitra,
                                tanggalTransfer: data.tanggal.split("T")[0],
                                noSurat: data.catatan,
                                tanggalSurat: data.tanggalSurat || "",

                                suratPengajuan: null,
                                buktiTransfer: null,
                                bukuRekening: null,
                                rab: null,
                                sptjm: null,
                                laporanKegiatan: null
                              });

                              setShowAddModal(true);

                            }}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setConfirmDeleteId(item.id)}
                            className="
                            group
                            border-red-200
                            hover:bg-red-600 hover:border-red-600
                            transition-colors
                          "
                          >
                            <Trash2
                              className="
                                w-4 h-4
                                text-black
                                group-hover:text-white
                              "
                            />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* PAGINATION */}
              <div className="p-4 flex items-center justify-between text-sm">
                <span>
                  Showing {startEntry} to {endEntry} of{" "}
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
                      <span key={i} className="px-2 text-muted-foreground">
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
                    )
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

        {/* ================= MODAL ADD / EDIT ================= */}

        {showAddModal && (
          <Modal
            onClose={() => {
              setShowAddModal(false);
              setEditId(null);
            }}
            onSave={handleSavePencairan}
            newPencairan={newPencairan}
            setNewPencairan={setNewPencairan}
            setPreviewFile={setPreviewFile}
            errors={errors}
            isEdit={isEdit}
            setErrorModal={setErrorModal}
          />
        )}



        {/* ================= SUCCESS ADD ================= */}

        {showAddSuccess && (

          <div className="fixed inset-0 z-[999] bg-black/50 flex items-center justify-center">

            <div className="bg-white rounded-xl p-6 w-full max-w-sm text-center space-y-4 shadow-lg">

              <div className="flex justify-center">

                <CheckCircle className="w-10 h-10 text-green-600" />

              </div>

              <p className="text-base font-medium text-green-600">
                Berhasil
              </p>

              <p className="text-sm text-muted-foreground">
                Data pencairan berhasil ditambahkan
              </p>

              <div className="flex justify-center">

                <Button
                  size="sm"
                  onClick={() => setShowAddSuccess(false)}
                >

                  OK

                </Button>

              </div>

            </div>

          </div>

        )}



        {/* ================= SUCCESS EDIT ================= */}

        {showEditSuccess && (

          <div className="fixed inset-0 z-[999] bg-black/50 flex items-center justify-center">

            <div className="bg-white rounded-xl p-6 w-full max-w-sm text-center space-y-4 shadow-lg">

              <div className="flex justify-center">

                <CheckCircle className="w-10 h-10 text-green-600" />

              </div>

              <p className="text-base font-medium text-green-600">
                Berhasil
              </p>

              <p className="text-sm text-muted-foreground">
                Data pencairan berhasil diperbarui
              </p>

              <div className="flex justify-center">

                <Button
                  size="sm"
                  onClick={() => setShowEditSuccess(false)}
                >

                  OK

                </Button>

              </div>

            </div>

          </div>

        )}



        {/* ================= SUCCESS DELETE ================= */}

        {showDeleteSuccess && (

          <div className="fixed inset-0 z-[999] bg-black/50 flex items-center justify-center">

            <div className="bg-white rounded-xl p-6 w-full max-w-sm text-center space-y-4 shadow-lg">

              <div className="flex justify-center">

                <CheckCircle className="w-10 h-10 text-green-600" />

              </div>

              <p className="text-base font-medium text-green-600">
                Berhasil
              </p>

              <p className="text-sm text-muted-foreground">
                Data pencairan berhasil dihapus
              </p>

              <div className="flex justify-center">

                <Button
                  size="sm"
                  onClick={() => setShowDeleteSuccess(false)}
                >

                  OK

                </Button>

              </div>

            </div>

          </div>

        )}



        {/* ================= CONFIRM DELETE ================= */}
        <DeleteConfirmModal
          open={!!confirmDeleteId}
          onCancel={() => setConfirmDeleteId(null)}
          onConfirm={handleDelete}
          message="Apakah Anda yakin ingin menghapus pencairan dana ini? Data &amp; dokumen akan terhapus permanen."
        />

        {/* ================= DETAIL MODAL ================= */}
        {detailId && (
          <DetailModal
            id={detailId}
            onClose={() => setDetailId(null)}
            onEdit={async (id) => {
              const res = await fetch(API.pencairanDetail(id));
              const data = await res.json();
              setEditId(id);
              setDetailId(null);
              setNewPencairan({
                dasarDokumen: data.dasarDokumen,
                jumlah: data.jumlah,
                penanggungjawab: data.danaMitra,
                tanggalTransfer: data.tanggal?.split("T")[0] ?? "",
                noSurat: data.catatan,
                tanggalSurat: data.tanggalSurat || "",
                suratPengajuan: null,
                buktiTransfer: null,
                bukuRekening: null,
                rab: null,
                sptjm: null,
                laporanKegiatan: null,
              });
              setShowAddModal(true);
            }}
          />
        )}



        {/* ================= PREVIEW PDF ================= */}
        {previewFile && (
          <PreviewModal
            file={previewFile}
            onClose={() => setPreviewFile(null)}
          />
        )}

        {/* ================= ERROR MODAL ================= */}
        <ErrorModal
          open={!!errorModal}
          onClose={() => setErrorModal(null)}
          message={errorModal ?? ""}
        />
      </div>
    </div>
  );
}

/* ================= MODALS ================= */
function Modal({
  onClose,
  onSave,
  newPencairan,
  setNewPencairan,
  setPreviewFile,
  errors,
  isEdit,
  setErrorModal,
}: {
  onClose: () => void;
  onSave: () => void;
  newPencairan: any;
  setNewPencairan: any;
  setPreviewFile: (f: File | null) => void;
  errors: Record<string, string>;
  isEdit: boolean;
  setErrorModal: (msg: string | null) => void;
}) {

  const isFormValid = true;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center p-4">
      <div
        className="
          bg-white rounded-xl shadow-xl
          w-full max-w-3xl
          max-h-[85vh]
          flex flex-col
        "
      >
        {/* ================= HEADER (FIXED) ================= */}
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
          <h3 className="text-sm font-semibold">
            {isEdit ? "Edit Pencairan Dana" : "Add Pencairan Dana"}
          </h3>
          <button onClick={onClose} className="
              group
              rounded-sm
              p-1
              transition-colors
              hover:bg-[#0079C4]
            "
          >
            <X
              className="
                w-4 h-4
                text-muted-foreground
                transition-colors
                group-hover:text-white
              "
            />
          </button>
        </div>

        {/* ================= BODY (SCROLLABLE) ================= */}
        <div className="px-6 py-4 space-y-3 text-sm overflow-y-auto">
          <Input
            label="Dasar Dokumen"
            value={newPencairan.dasarDokumen}
            error={errors.dasarDokumen}
            onChange={(v) =>
              setNewPencairan({ ...newPencairan, dasarDokumen: v })
            }
          />

          <Input
            label="Jumlah Ditransfer"
            placeholder="Rp..."
            value={newPencairan.jumlah}
            error={errors.jumlah}
            onChange={(v) =>
              setNewPencairan({ ...newPencairan, jumlah: v })
            }
          />

          <Input
            label="Penanggungjawab"
            placeholder="nama penanggungjawab"
            value={newPencairan.penanggungjawab}
            error={errors.penanggungjawab}
            onChange={(v) =>
              setNewPencairan({ ...newPencairan, penanggungjawab: v })
            }
          />

          <Input
            label="Tanggal Ditransfer"
            type="date"
            value={newPencairan.tanggalTransfer}
            error={errors.tanggalTransfer}
            onChange={(v) =>
              setNewPencairan({ ...newPencairan, tanggalTransfer: v })
            }
          />

          <Input
            label="No. Surat Pengajuan"
            value={newPencairan.noSurat}
            error={errors.noSurat}
            onChange={(v) =>
              setNewPencairan({ ...newPencairan, noSurat: v })
            }
          />

          <Input
            label="Tgl. Surat Pengajuan"
            type="date"
            value={newPencairan.tanggalSurat}
            error={errors.tanggalSurat}
            onChange={(v) =>
              setNewPencairan({ ...newPencairan, tanggalSurat: v })
            }
          />

          {/* FILE INPUTS */}
          <FileInput
            label="Surat Pengajuan"
            file={newPencairan.suratPengajuan}
            setFile={(f) =>
              setNewPencairan({ ...newPencairan, suratPengajuan: f })
            }
            onView={setPreviewFile}
            error={errors.suratPengajuan}
            onError={(msg) => setErrorModal(msg)}
          />

          <FileInput
            label="Bukti Transfer"
            file={newPencairan.buktiTransfer}
            setFile={(f) =>
              setNewPencairan({ ...newPencairan, buktiTransfer: f })
            }
            onView={setPreviewFile}
            error={errors.buktiTransfer}
            onError={(msg) => setErrorModal(msg)}
          />

          <FileInput
            label="Buku Rekening"
            file={newPencairan.bukuRekening}
            setFile={(f) =>
              setNewPencairan({ ...newPencairan, bukuRekening: f })
            }
            onView={setPreviewFile}
            error={errors.bukuRekening}
            onError={(msg) => setErrorModal(msg)}
          />

          <FileInput
            label="RAB"
            file={newPencairan.rab}
            setFile={(f) =>
              setNewPencairan({ ...newPencairan, rab: f })
            }
            onView={setPreviewFile}
            error={errors.rab}
            onError={(msg) => setErrorModal(msg)}
          />

          <FileInput
            label="SPTJM"
            file={newPencairan.sptjm}
            setFile={(f) =>
              setNewPencairan({ ...newPencairan, sptjm: f })
            }
            onView={setPreviewFile}
            error={errors.sptjm}
            onError={(msg) => setErrorModal(msg)}
          />

          <FileInput
            label="Laporan Kegiatan"
            file={newPencairan.laporanKegiatan}
            setFile={(f) =>
              setNewPencairan({ ...newPencairan, laporanKegiatan: f })
            }
            onView={setPreviewFile}
            error={errors.laporanKegiatan}
            onError={(msg) => setErrorModal(msg)}
          />

          <p className="text-xs text-red-500">
            * file wajib PDF maks. 2 MB
          </p>
        </div>

        {/* ================= FOOTER (FIXED) ================= */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t shrink-0 bg-background">
          <Button variant="destructive" onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={onSave}
            disabled={!isEdit && !isFormValid}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ================= DETAIL MODAL ================= */
function DetailModal({
  id,
  onClose,
  onEdit,
}: {
  id: string;
  onClose: () => void;
  onEdit: (id: string) => void;
}) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [previewFile, setPreviewFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(API.pencairanDetail(id));
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-6 w-full max-w-md text-center">
          <p className="text-sm text-muted-foreground">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-6 w-full max-w-md text-center space-y-4">
          <p className="text-sm text-red-500">Data tidak ditemukan</p>
          <Button onClick={onClose}>Tutup</Button>
        </div>
      </div>
    );
  }

  const docLabels: Record<string, string> = {
    suratPengajuan: "Surat Pengajuan",
    buktiTransfer: "Bukti Transfer",
    bukuRekening: "Buku Rekening",
    rab: "RAB",
    sptjm: "SPTJM",
    laporanKegiatan: "Laporan Kegiatan",
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
          <h3 className="text-sm font-semibold">Detail Pencairan Dana</h3>
          <button
            onClick={onClose}
            className="group rounded-sm p-1 transition-colors hover:bg-[#0079C4]"
          >
            <X className="w-4 h-4 text-muted-foreground transition-colors group-hover:text-white" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-4 overflow-y-auto text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Dasar Dokumen</p>
              <p className="font-medium">{data.dasarDokumen ?? "-"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Dana Mitra</p>
              <p className="font-medium">{data.danaMitra ?? "-"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Jumlah</p>
              <p className="font-medium">
                Rp {(Number(data.jumlah) || 0).toLocaleString("id-ID")}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Tanggal Transfer</p>
              <p className="font-medium">
                {data.tanggal
                  ? new Date(data.tanggal).toLocaleDateString("id-ID")
                  : "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">No. Surat</p>
              <p className="font-medium">{data.catatan ?? "-"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <StatusBadge status={data.status ?? "Draft"} />
            </div>
          </div>

          {/* Dokumen */}
          <div className="border-t pt-4">
            <p className="text-xs text-muted-foreground mb-3">Dokumen</p>
            <div className="space-y-2">
              {Object.entries(docLabels).map(([key, label]) => {
                const url = data.dokumen?.[key];
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between border rounded-lg px-3 py-2"
                  >
                    <span className="text-sm">{label}</span>
                    {url ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(url, "_blank")}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Lihat
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Tidak ada
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t shrink-0 bg-background">
          <Button variant="destructive" onClick={onClose}>
            Tutup
          </Button>
          <Button
            onClick={() => onEdit(id)}
          >
            <Pencil className="w-4 h-4 mr-1" />
            Edit
          </Button>
        </div>
      </div>

      {/* Preview PDF */}
      {previewFile && (
        <PreviewModal
          file={previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}
    </div>
  );
}