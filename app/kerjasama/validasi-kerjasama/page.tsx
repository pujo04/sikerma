"use client";

import { useState, useMemo, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RefreshCcw, ArrowLeft } from "lucide-react";

/* ================= DUMMY DATA ================= */

type Dokumen = {
  id: number;
  nomor: string;
  judul: string;
  tanggal: string;
  status: "Menunggu" | "Disetujui" | "Ditolak";
};

const DUMMY_DATA: Dokumen[] = Array.from({ length: 323 }, (_, i) => ({
  id: i + 1,
  nomor: `DOC-${String(i + 1).padStart(4, "0")}`,
  judul: `Kerja Sama Institusi ${i + 1}`,
  tanggal: "2025-01-10",
  status: "Menunggu",
}));

/* ================= PAGE ================= */

export default function ValidasiKerjasamaPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
useEffect(() => {
  document.title = "SIKERMA - Validasi Kerjasama";
}, []);
  /* search & pagination state */
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  /* ================= FILTER DATA ================= */

  const filteredData = useMemo(() => {
    return DUMMY_DATA.filter((item) =>
      `${item.nomor} ${item.judul} ${item.status}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [search]);

  const totalPages = Math.ceil(filteredData.length / limit);

  const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

  /* reset page when search / limit changes */
  useMemo(() => {
    setPage(1);
  }, [search, limit]);
  /* ================= PAGINATION NUMBER ================= */

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
                  Validasi Dokumen
                </h1>
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
                      type="text"
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
                        <th className="px-3 py-2 text-left">No</th>
                        <th className="px-3 py-2 text-left">Nomor Dokumen</th>
                        <th className="px-3 py-2 text-left">Judul Kegiatan</th>
                        <th className="px-3 py-2 text-left">Tgl. Unggah</th>
                        <th className="px-3 py-2 text-left">Status</th>
                        <th className="px-3 py-2 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedData.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="text-center py-10 text-muted-foreground"
                          >
                            Tidak ada data
                          </td>
                        </tr>
                      ) : (
                        paginatedData.map((item, index) => (
                          <tr key={item.id} className="border-b">
                            <td className="px-3 py-2">
                              {(page - 1) * limit + index + 1}
                            </td>
                            <td className="px-3 py-2">{item.nomor}</td>
                            <td className="px-3 py-2">{item.judul}</td>
                            <td className="px-3 py-2">{item.tanggal}</td>
                            <td className="px-3 py-2">
                              <span className="px-2 py-0.5 rounded bg-yellow-100 text-yellow-700 text-xs">
                                {item.status}
                              </span>
                            </td>
                            <td className="px-3 py-2">
                              <Button size="sm" variant="outline">
                                Detail
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* FOOTER */}
                <div className="p-4 flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    Showing {(page - 1) * limit + 1} to{" "}
                    {Math.min(page * limit, filteredData.length)} of{" "}
                    {filteredData.length} entries
                  </span>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
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
                          onClick={() => setPage(p)}
                        >
                          {p}
                        </Button>
                      ),
                    )}

                    <Button
                      variant="outline"
                      size="sm"
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
    </div>
  );
}
