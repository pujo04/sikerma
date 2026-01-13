"use client"

import { useState } from "react"
import { Download, List, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Sample data - replace with actual data from API
const sampleDocuments = [
  {
    id: 1,
    jenis: "IA",
    nomor: "14415/UN26.13/KS.00/2025",
    judul:
      "Rancangan Pelaksanaan Kegiatan (Implementation Arrangements) antara Program Studi Pendidikan Pancasila dan Kewarganegaraan Fakultas Keguruan dan Ilmu Pendidikan Universitas Lampung dengan Program Studi Pendidikan Pancasila dan Kewarganegaraan Fakultas Keguruan dan Ilmu Pendidikan Universitas Sriwijaya",
    expiredDate: "14/11/2026",
    status: "Aktif",
    statusDokumen: "Aktif",
    periode: "14-11-2025 s.d. 14-11-2026",
    deskripsi: "Kuliah Umum yang diisi oleh Pihak Kesatu",
    dasarDokumen: "Tidak ada",
    unitPelaksana: "1. 87205 | S1 | S1 Pendidikan Pancasila Dan Kewarganegaraan",
    penanggungJawab: "Dr. Albet Maydiantoro, M.Pd.",
    unitPenanggungJawab: "Fakultas Keguruan dan Ilmu Pendidikan",
    sumberDana: "Lainnya",
    anggaran: "0,00",
    bentukKegiatan: "1. Pengabdian Kepada Masyarakat",
    paraPenggiat:
      "Pihak Ke-1 | Universitas Lampung | Dr. Albet Maydiantoro, M.Pd.\nPihak Ke-2 | Universitas Sriwijaya | Dr. Hartono, M.A.",
    skala: "Nasional",
  },
  {
    id: 2,
    jenis: "IA",
    nomor: "6258/UN26.13/KS.00.00/2025",
    judul: "Pelaksanaan Kuliah Dosen Tamu UNILA dan UNJ",
    expiredDate: "11/06/2026",
    status: "Aktif",
    statusDokumen: "Aktif",
    periode: "11-06-2025 s.d. 11-06-2026",
    deskripsi: "Kuliah Dosen Tamu antara UNILA dan UNJ",
    dasarDokumen: "Tidak ada",
    unitPelaksana: "1. 87205 | S1 | S1 Pendidikan Pancasila Dan Kewarganegaraan",
    penanggungJawab: "Dr. Rina Sari, M.Pd.",
    unitPenanggungJawab: "Fakultas Keguruan dan Ilmu Pendidikan",
    sumberDana: "Lainnya",
    anggaran: "0,00",
    bentukKegiatan: "1. Pengabdian Kepada Masyarakat",
    paraPenggiat:
      "Pihak Ke-1 | Universitas Lampung | Dr. Rina Sari, M.Pd.\nPihak Ke-2 | Universitas Negeri Jakarta | Dr. Budi Santoso, M.Pd.",
    skala: "Nasional",
  },
  {
    id: 3,
    jenis: "IA",
    nomor: "11291/UN26.13/KS.00.00/2025",
    judul: "Kegiatan Tri Darma Perguruan Tinggi",
    expiredDate: "31/12/2025",
    status: "Aktif",
    statusDokumen: "Aktif",
    periode: "01-01-2025 s.d. 31-12-2025",
    deskripsi: "Kegiatan Tri Darma Perguruan Tinggi",
    dasarDokumen: "Tidak ada",
    unitPelaksana: "1. 87205 | S1 | S1 Pendidikan Pancasila Dan Kewarganegaraan",
    penanggungJawab: "Dr. Ahmad Fauzi, M.Pd.",
    unitPenanggungJawab: "Fakultas Keguruan dan Ilmu Pendidikan",
    sumberDana: "Lainnya",
    anggaran: "0,00",
    bentukKegiatan: "1. Penelitian",
    paraPenggiat: "Pihak Ke-1 | Universitas Lampung | Dr. Ahmad Fauzi, M.Pd.",
    skala: "Nasional",
  },
  {
    id: 4,
    jenis: "MoU",
    nomor: "13679/UN26/KS.00.02/2025",
    judul:
      "Nota Kesepahaman Antara Universitas Lampung Dengan Sekolah Tinggi Keguruan dan Ilmu Pendidikan Al Islam Tunas Bangsa",
    expiredDate: "31/10/2030",
    status: "Aktif",
    statusDokumen: "Aktif",
    periode: "31-10-2025 s.d. 31-10-2030",
    deskripsi: "Nota Kesepahaman untuk kerjasama pendidikan",
    dasarDokumen: "Tidak ada",
    unitPelaksana: "1. 87205 | S1 | S1 Pendidikan Pancasila Dan Kewarganegaraan",
    penanggungJawab: "Prof. Dr. Siti Aminah, M.Pd.",
    unitPenanggungJawab: "Rektorat",
    sumberDana: "APBN",
    anggaran: "50000000,00",
    bentukKegiatan: "1. Pendidikan dan Pengajaran",
    paraPenggiat:
      "Pihak Ke-1 | Universitas Lampung | Prof. Dr. Siti Aminah, M.Pd.\nPihak Ke-2 | STKIP Al Islam Tunas Bangsa | Dr. Bambang Suryanto, M.Pd.",
    skala: "Lokal",
  },
  {
    id: 5,
    jenis: "IA",
    nomor: "9036/UN26.13/KS.00.00/2025",
    judul:
      "IA antara Program Studi Pendidikan Bahasa Inggris Universitas Lampung dengan Program Studi Pendidikan Bahasa Inggris FKIP Universitas Mahasaraswati Denpasar",
    expiredDate: "04/08/2026",
    status: "Aktif",
    statusDokumen: "Aktif",
    periode: "04-08-2025 s.d. 04-08-2026",
    deskripsi: "Implementation Arrangement untuk pertukaran mahasiswa dan dosen",
    dasarDokumen: "MoU 7890/UN26.13/KS.00.00/2024",
    unitPelaksana: "1. 87206 | S1 | S1 Pendidikan Bahasa Inggris",
    penanggungJawab: "Dr. Linda Mayasari, M.Pd.",
    unitPenanggungJawab: "Fakultas Keguruan dan Ilmu Pendidikan",
    sumberDana: "Lainnya",
    anggaran: "0,00",
    bentukKegiatan: "1. Pendidikan dan Pengajaran",
    paraPenggiat:
      "Pihak Ke-1 | Universitas Lampung | Dr. Linda Mayasari, M.Pd.\nPihak Ke-2 | Universitas Mahasaraswati Denpasar | Dr. I Made Sutama, M.Pd.",
    skala: "Nasional",
  },
  {
    id: 6,
    jenis: "MoU",
    nomor: "15553.A/UN26.13/KS/2025",
    judul: "PKS ANTARA STIT PRINGSEWU DAN PRODI MKGSO FKIP UNIVERSITAS LAMPUNG",
    expiredDate: "05/12/2030",
    status: "Aktif",
    statusDokumen: "Aktif",
    periode: "05-12-2025 s.d. 05-12-2030",
    deskripsi: "Perjanjian Kerja Sama bidang pendidikan dan penelitian",
    dasarDokumen: "Tidak ada",
    unitPelaksana: "1. 87205 | S1 | S1 Pendidikan Pancasila Dan Kewarganegaraan",
    penanggungJawab: "Dr. Yudi Hartono, M.Pd.",
    unitPenanggungJawab: "Fakultas Keguruan dan Ilmu Pendidikan",
    sumberDana: "APBN",
    anggaran: "25000000,00",
    bentukKegiatan: "1. Penelitian\n2. Pengabdian Kepada Masyarakat",
    paraPenggiat:
      "Pihak Ke-1 | Universitas Lampung | Dr. Yudi Hartono, M.Pd.\nPihak Ke-2 | STIT Pringsewu | Dr. Muhammad Ali, M.Pd.I.",
    skala: "Lokal",
  },
]

interface RepositoryTableProps {
  onViewDetail: (document: any) => void
}

export function RepositoryTable({ onViewDetail }: RepositoryTableProps) {
  const [search, setSearch] = useState("")
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState<{
    key: string | null
    direction: "asc" | "desc"
  }>({ key: null, direction: "asc" })

  // Filter documents based on search
  const filteredDocuments = sampleDocuments.filter((doc) =>
    Object.values(doc).some((value) => value.toString().toLowerCase().includes(search.toLowerCase())),
  )

  // Sort documents
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    if (!sortConfig.key) return 0

    const aValue = a[sortConfig.key as keyof typeof a]
    const bValue = b[sortConfig.key as keyof typeof b]

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
    return 0
  })

  // Pagination
  const totalPages = Math.ceil(sortedDocuments.length / entriesPerPage)
  const startIndex = (currentPage - 1) * entriesPerPage
  const endIndex = startIndex + entriesPerPage
  const currentDocuments = sortedDocuments.slice(startIndex, endIndex)

  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc",
    })
  }

  const handleDownload = (doc: any) => {
    // Implement download functionality
    console.log("[v0] Download document:", doc.nomor)
    alert(`Downloading: ${doc.nomor}`)
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Repository</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-primary border-primary bg-transparent">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="text-secondary border-secondary bg-transparent">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add
          </Button>
          <Button variant="outline" size="sm" className="text-destructive border-destructive bg-transparent">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Show</span>
          <select
            value={entriesPerPage}
            onChange={(e) => {
              setEntriesPerPage(Number(e.target.value))
              setCurrentPage(1)
            }}
            className="px-3 py-1.5 border border-border rounded-md bg-background text-sm"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span className="text-sm text-muted-foreground">entries</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Search:</span>
          <Input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            className="w-64"
            placeholder="Search..."
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th
                className="px-4 py-3 text-left font-medium text-foreground cursor-pointer hover:bg-muted"
                onClick={() => handleSort("id")}
              >
                <div className="flex items-center gap-1">
                  No
                  {sortConfig.key === "id" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    ))}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left font-medium text-foreground cursor-pointer hover:bg-muted"
                onClick={() => handleSort("jenis")}
              >
                <div className="flex items-center gap-1">
                  Jenis
                  {sortConfig.key === "jenis" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    ))}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left font-medium text-foreground cursor-pointer hover:bg-muted"
                onClick={() => handleSort("nomor")}
              >
                <div className="flex items-center gap-1">
                  Nomor Dokumen
                  {sortConfig.key === "nomor" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    ))}
                </div>
              </th>
              <th className="px-4 py-3 text-left font-medium text-foreground w-1/3">Judul Kegiatan</th>
              <th
                className="px-4 py-3 text-left font-medium text-foreground cursor-pointer hover:bg-muted"
                onClick={() => handleSort("expiredDate")}
              >
                <div className="flex items-center gap-1">
                  Expired Date
                  {sortConfig.key === "expiredDate" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    ))}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left font-medium text-foreground cursor-pointer hover:bg-muted"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center gap-1">
                  Status
                  {sortConfig.key === "status" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    ))}
                </div>
              </th>
              <th className="px-4 py-3 text-center font-medium text-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentDocuments.map((doc, index) => (
              <tr key={doc.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 text-foreground">{startIndex + index + 1}</td>
                <td className="px-4 py-3 text-foreground font-medium">{doc.jenis}</td>
                <td className="px-4 py-3 text-foreground">{doc.nomor}</td>
                <td className="px-4 py-3 text-primary hover:underline cursor-pointer" onClick={() => onViewDetail(doc)}>
                  {doc.judul}
                </td>
                <td className="px-4 py-3 text-foreground">{doc.expiredDate}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {doc.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-primary hover:text-primary hover:bg-primary/10"
                      onClick={() => handleDownload(doc)}
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-secondary hover:text-secondary hover:bg-secondary/10"
                      onClick={() => onViewDetail(doc)}
                      title="View Detail"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1} to {Math.min(endIndex, sortedDocuments.length)} of {sortedDocuments.length} entries
        </div>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
            First
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(page)}
              className={currentPage === page ? "bg-primary text-primary-foreground" : ""}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            Last
          </Button>
        </div>
      </div>
    </div>
  )
}
