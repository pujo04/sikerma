"use client";

import { useState, useMemo, useEffect } from "react";
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

type PencairanDana = {
  id: number;
  dasarDokumen: string;
  danaMitra: string;
  jumlah: number;
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

  useEffect(() => {
  document.title = "SIKERMA - Pencairan Dana";
}, []);

  /* ================= DUMMY ================= */
  const DUMMY_PENCAIRAN: PencairanDana[] = [
    {
      id: 1,
      dasarDokumen: "MoU Universitas Lampung - Bank Mitra",
      danaMitra: "Bank Mitra",
      jumlah: 25000000,
      tanggal: "2024-01-10",
      catatan: "Termin 1",
      status: "Disetujui",
    },
    {
      id: 2,
      dasarDokumen: "MoA Fakultas Teknik",
      danaMitra: "PT Teknologi Nusantara",
      jumlah: 15000000,
      tanggal: "2024-01-15",
      catatan: "Pembayaran awal",
      status: "Diajukan",
    },
    {
      id: 3,
      dasarDokumen: "IA Penelitian Pertanian",
      danaMitra: "Kementerian Pertanian",
      jumlah: 30000000,
      tanggal: "2024-01-20",
      catatan: "Termin 1",
      status: "Disetujui",
    },
    {
      id: 4,
      dasarDokumen: "MoU Kerjasama Industri",
      danaMitra: "PT Industri Jaya",
      jumlah: 20000000,
      tanggal: "2024-01-25",
      catatan: "Dana operasional",
      status: "Draft",
    },
    {
      id: 5,
      dasarDokumen: "MoA Program Magang",
      danaMitra: "PT Mitra Karya",
      jumlah: 40000000,
      tanggal: "2024-02-01",
      catatan: "Termin 1",
      status: "Diajukan",
    },
    {
      id: 6,
      dasarDokumen: "IA Pengabdian Masyarakat",
      danaMitra: "Pemda Lampung",
      jumlah: 12000000,
      tanggal: "2024-02-05",
      catatan: "Dana kegiatan",
      status: "Disetujui",
    },
    {
      id: 7,
      dasarDokumen: "MoU Beasiswa Pendidikan",
      danaMitra: "Yayasan Pendidikan",
      jumlah: 18000000,
      tanggal: "2024-02-10",
      catatan: "Tahap awal",
      status: "Disetujui",
    },
    {
      id: 8,
      dasarDokumen: "MoA Pelatihan Digital",
      danaMitra: "PT Digital Solusi",
      jumlah: 10000000,
      tanggal: "2024-02-15",
      catatan: "Pelatihan batch 1",
      status: "Diajukan",
    },
    {
      id: 9,
      dasarDokumen: "IA Riset Energi",
      danaMitra: "BRIN",
      jumlah: 35000000,
      tanggal: "2024-02-20",
      catatan: "Termin riset",
      status: "Disetujui",
    },
    {
      id: 10,
      dasarDokumen: "MoU Kerjasama Internasional",
      danaMitra: "Universitas Luar Negeri",
      jumlah: 50000000,
      tanggal: "2024-02-25",
      catatan: "Pendanaan awal",
      status: "Draft",
    },
    {
      id: 11,
      dasarDokumen: "MoA Dosen Praktisi",
      danaMitra: "Perusahaan Nasional",
      jumlah: 22000000,
      tanggal: "2024-03-01",
      catatan: "Honorarium",
      status: "Disetujui",
    },
    {
      id: 12,
      dasarDokumen: "IA Sistem Informasi",
      danaMitra: "UPT TIK",
      jumlah: 8000000,
      tanggal: "2024-03-05",
      catatan: "Pengembangan sistem",
      status: "Ditolak",
    },
    {
      id: 13,
      dasarDokumen: "MoU Riset Multidisiplin",
      danaMitra: "Konsorsium Riset",
      jumlah: 45000000,
      tanggal: "2024-03-10",
      catatan: "Termin 2",
      status: "Diajukan",
    },
    {
      id: 14,
      dasarDokumen: "MoA Sertifikasi Mahasiswa",
      danaMitra: "Lembaga Sertifikasi",
      jumlah: 17000000,
      tanggal: "2024-03-15",
      catatan: "Biaya sertifikasi",
      status: "Disetujui",
    },
    {
      id: 15,
      dasarDokumen: "IA Workshop Proposal Hibah",
      danaMitra: "Direktorat Dikti",
      jumlah: 9000000,
      tanggal: "2024-03-20",
      catatan: "Dana pelatihan",
      status: "Draft",
    },
  ];

  /* ================= DATA ================= */

  const [pencairanData, setPencairanData] = useState<PencairanDana[]>(DUMMY_PENCAIRAN);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);

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
  });

  /* ================= FILTER ================= */

  const filteredData = useMemo(() => {
    const keyword = search.toLowerCase();

    return pencairanData.filter((item) =>
      `${item.dasarDokumen} ${item.danaMitra} ${item.status} ${item.catatan}`
        .toLowerCase()
        .includes(keyword)
    );
  }, [search, pencairanData]);

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
  /* ================= UI ================= */

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
                          Rp {item.jumlah.toLocaleString("id-ID")}
                        </td>
                        <td className="px-3 py-2 text-center">
                          {item.tanggal}
                        </td>
                        <td className="px-3 py-2 text-center">
                          {item.catatan}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <StatusBadge status={item.status} />
                        </td>
                        <td className="px-3 py-2 text-center flex gap-1 justify-center">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            title="Hapus Dokumen"
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
                                transition-colors
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
                        onClick={() => setPage(p)}
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

      {/* ================= MODAL ADD ================= */}
{showAddModal && (
  <Modal
    onClose={() => {
      setShowAddModal(false);
      setPreviewFile(null);
    }}
    onSave={() => {
      setPencairanData((prev) => [
        {
          id: Date.now(),
          dasarDokumen: newPencairan.dasarDokumen,
          danaMitra: newPencairan.penanggungjawab,
          jumlah: Number(newPencairan.jumlah),
          tanggal: newPencairan.tanggalTransfer,
          catatan: newPencairan.noSurat,
          status: "Diajukan",
        },
        ...prev,
      ]);

      // reset form
      setNewPencairan({
        dasarDokumen: "",
        jumlah: "",
        penanggungjawab: "",
        tanggalTransfer: "",
        noSurat: "",
        tanggalSurat: "",
        suratPengajuan: null,
        buktiTransfer: null,
        bukuRekening: null,
        rab: null,
        sptjm: null,
      });

      setPreviewFile(null);
      setShowAddModal(false);
      setShowSuccess(true);
    }}
    newPencairan={newPencairan}
    setNewPencairan={setNewPencairan}
    setPreviewFile={setPreviewFile}
  />
)}

        {previewFile && (
          <PreviewModal
            file={previewFile}
            onClose={() => setPreviewFile(null)}
          />
        )}

        {showSuccess && <SuccessModal onClose={() => setShowSuccess(false)} />}
      </div>
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

function Input({ label, type = "text", value, onChange }: any) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-md px-3 py-2 text-sm"
      />
    </div>
  );
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

function validatePdf(file: File) {
  if (file.type !== "application/pdf") {
    alert("File harus berformat PDF");
    return false;
  }

  if (file.size > MAX_FILE_SIZE) {
    alert("Ukuran file maksimal 2 MB");
    return false;
  }

  return true;
}

function FileInput({ label, file, setFile, onView }: any) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    if (!validatePdf(selectedFile)) {
      e.target.value = ""; // reset input
      return;
    }

    setFile(selectedFile);
  };

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>

      <div className="flex border rounded-md overflow-hidden">
        <label className="px-3 py-2 bg-muted cursor-pointer">
          Choose File
          <input
            type="file"
            accept="application/pdf"
            hidden
            onChange={handleChange}
          />
        </label>

        <div className="flex-1 px-3 py-2 text-sm truncate">
          {file ? file.name : "No file chosen"}
        </div>

        {file && (
          <div className="flex gap-1 px-2 items-center">
            <button type="button" onClick={() => onView(file)}>
              <Eye className="w-4 h-4" />
            </button>
            <button type="button" onClick={() => setFile(null)}>
              <X className="w-4 h-4 text-red-500" />
            </button>
          </div>
        )}
      </div>

      {file && (
        <p className="text-xs text-muted-foreground">
          {(file.size / 1024 / 1024).toFixed(2)} MB
        </p>
      )}
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
}: Props) {
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
          <h3 className="text-sm font-semibold">Add Pencairan Dana</h3>
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
            onChange={(v) =>
              setNewPencairan({ ...newPencairan, dasarDokumen: v })
            }
          />

          <Input
            label="Jumlah Ditransfer"
            placeholder="Rp..."
            value={newPencairan.jumlah}
            onChange={(v) =>
              setNewPencairan({ ...newPencairan, jumlah: v })
            }
          />

          <Input
            label="Penanggungjawab"
            placeholder="nama penanggungjawab"
            value={newPencairan.penanggungjawab}
            onChange={(v) =>
              setNewPencairan({ ...newPencairan, penanggungjawab: v })
            }
          />

          <Input
            label="Tanggal Ditransfer"
            type="date"
            value={newPencairan.tanggalTransfer}
            onChange={(v) =>
              setNewPencairan({ ...newPencairan, tanggalTransfer: v })
            }
          />

          <Input
            label="No. Surat Pengajuan"
            value={newPencairan.noSurat}
            onChange={(v) =>
              setNewPencairan({ ...newPencairan, noSurat: v })
            }
          />

          <Input
            label="Tgl. Surat Pengajuan"
            type="date"
            value={newPencairan.tanggalSurat}
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
          />

          <FileInput
            label="Bukti Transfer"
            file={newPencairan.buktiTransfer}
            setFile={(f) =>
              setNewPencairan({ ...newPencairan, buktiTransfer: f })
            }
            onView={setPreviewFile}
          />

          <FileInput
            label="Buku Rekening"
            file={newPencairan.bukuRekening}
            setFile={(f) =>
              setNewPencairan({ ...newPencairan, bukuRekening: f })
            }
            onView={setPreviewFile}
          />

          <FileInput
            label="RAB"
            file={newPencairan.rab}
            setFile={(f) =>
              setNewPencairan({ ...newPencairan, rab: f })
            }
            onView={setPreviewFile}
          />

          <FileInput
            label="SPTJM"
            file={newPencairan.sptjm}
            setFile={(f) =>
              setNewPencairan({ ...newPencairan, sptjm: f })
            }
            onView={setPreviewFile}
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
          <Button onClick={onSave}>Save</Button>
        </div>
      </div>
    </div>
  );
}

function PreviewModal({ file, onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white rounded-xl w-full max-w-4xl h-[80vh] flex flex-col">
        <div className="p-3 border-b flex justify-between">
          <span>Preview Dokumen</span>
          <button onClick={onClose}><X/></button>
        </div>
        <iframe src={URL.createObjectURL(file)} className="flex-1"/>
      </div>
    </div>
  );
}

function SuccessModal({ onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white rounded-xl p-6 text-center space-y-4">
        <div className="text-green-600 text-4xl">✔</div>
        <p>Data pencairan dana berhasil ditambahkan</p>
        <Button onClick={onClose}>OK</Button>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: PencairanDana["status"] }) {
  const base =
    "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium";

  const variants: Record<PencairanDana["status"], string> = {
    Draft: "bg-gray-600 text-white",
    Diajukan: "bg-blue-600 text-white",
    Disetujui: "bg-green-600 text-white",
    Ditolak: "bg-red-600 text-white",
  };

  return (
    <span className={`${base} ${variants[status]}`}>
      {status}
    </span>
  );
}