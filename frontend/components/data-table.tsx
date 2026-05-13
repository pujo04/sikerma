import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Column<T> = {
  key: string;
  header: string;
  render?: (item: T, index: number) => React.ReactNode;
  className?: string;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  searchValue?: string;
  limitOptions?: number[];
  limit?: number;
  onLimitChange?: (value: number) => void;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  showPagination?: boolean;
};

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  loading = false,
  emptyMessage = "Tidak ada data",
  searchable = true,
  searchPlaceholder = "Search...",
  onSearch,
  searchValue = "",
  limitOptions = [10, 25, 50],
  limit = 10,
  onLimitChange,
  page = 1,
  totalPages = 1,
  onPageChange,
  showPagination = true,
}: DataTableProps<T>) {
  const [internalSearch, setInternalSearch] = useState(searchValue);

  const handleSearch = (value: string) => {
    setInternalSearch(value);
    onSearch?.(value);
  };

  return (
    <div className="rounded-lg border bg-card">
      {/* CONTROLS */}
      <div className="flex items-center justify-between p-4 text-sm">
        {/* SHOW LIMIT */}
        <div className="flex items-center gap-2">
          <span>Show</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange?.(Number(e.target.value))}
            className="border rounded px-2 py-1"
          >
            {limitOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <span>entries</span>
        </div>

        {/* SEARCH */}
        {searchable && (
          <div className="flex items-center gap-2">
            <span>Search:</span>
            <input
              value={internalSearch}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="border rounded px-2 py-1"
            />
          </div>
        )}
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-t">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-3 py-2 text-center w-[60px]">No</th>
              {columns.map((col) => (
                <th key={col.key} className={cn("px-3 py-2", col.className)}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="py-6 text-center text-muted-foreground"
                >
                  Memuat data...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="py-6 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={item.id} className="border-b hover:bg-muted/40">
                  <td className="px-3 py-2 text-center">{index + 1}</td>
                  {columns.map((col) => (
                    <td key={col.key} className={cn("px-3 py-2", col.className)}>
                      {col.render
                        ? col.render(item, index)
                        : (item as any)[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {showPagination && (
        <div className="p-4 flex justify-between text-sm">
          <span>
            Showing {(page - 1) * limit + 1} to{" "}
            {Math.min(page * limit, data.length)} of {data.length} entries
          </span>

          <div className="flex gap-1">
            <Button
              size="sm"
              variant="outline"
              disabled={page === 1}
              onClick={() => onPageChange?.(page - 1)}
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
              onClick={() => onPageChange?.(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
