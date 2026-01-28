"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RefreshCcw, ArrowLeft, Eye } from "lucide-react";

/* ================= TYPES ================= */

type Subunit = {
  id: number;
  kodeUnit: string;
  namaUnit: string;
  jumlahDokumen: number;
};

/* ================= DUMMY DATA ================= */

const DUMMY_SUBUNIT: Subunit[] = Array.from({ length: 37 }, (_, i) => ({
  id: i + 1,
  kodeUnit: `UN26.${100 + i}`,
  namaUnit: `Sub Unit Kerja ${i + 1}`,
  jumlahDokumen: (i * 3) % 20,
}));

/* ================= PAGE ================= */

export default function SubunitPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
useEffect(() => {
  document.title = "SIKERMA - Dokumen Subunit";
}, []);
  /* ================= FILTER ================= */

  const filteredData = useMemo(() => {
    return DUMMY_SUBUNIT.filter((item) =>
      `${item.kodeUnit} ${item.namaUnit}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [search]);

  /* ================= PAGINATION ================= */

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

  const startEntry = filteredData.length === 0 ? 0 : (page - 1) * limit + 1;

  const endEntry = Math.min(page * limit, filteredData.length);

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
                  Dokumen Subunit
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
                      className="border rounded px-2 py-1"
                      placeholder="Cari subunit..."
                    />
                  </div>
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-t">
                    <thead className="bg-muted/40">
                      <tr>
                        <th className="px-3 py-2 w-[60px]">No</th>
                        <th className="px-3 py-2">Kode Unit</th>
                        <th className="px-3 py-2">Nama Unit</th>
                        <th className="px-3 py-2 text-center">
                          Jumlah Dokumen
                        </th>
                        <th className="px-3 py-2 text-center">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {paginatedData.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
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
                            <td className="px-3 py-2">{item.kodeUnit}</td>
                            <td className="px-3 py-2">{item.namaUnit}</td>
                            <td className="px-3 py-2 text-center">
                              {item.jumlahDokumen}
                            </td>
                            <td className="px-3 py-2 text-center">
                              <Link href={`/kerjasama/subunit/${item.id}`}>
                                <Button size="sm" variant="outline">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </Link>
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
    </div>
  );
}
