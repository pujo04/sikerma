import { X, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ================= INPUT ================= */
type InputProps = {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
};

export function Input({
  label,
  type = "text",
  value,
  onChange,
  error,
  required,
  placeholder,
  className,
}: InputProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${error ? "border-red-500" : ""} ${className ?? ""}`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

/* ================= DELETE CONFIRM MODAL ================= */
type DeleteConfirmModalProps = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  confirmIcon?: React.ReactNode;
};

export function DeleteConfirmModal({
  open,
  onCancel,
  onConfirm,
  title = "Konfirmasi Hapus",
  message,
  confirmText = "Ya, Hapus",
  confirmIcon,
}: DeleteConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4 text-center">
        <div className="flex justify-center text-red-500">
          {confirmIcon ?? <Trash2 className="w-10 h-10" />}
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{message}</p>
        <div className="flex justify-center gap-2 pt-4">
          <Button variant="outline" onClick={onCancel}>
            Batal
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ================= FILE INPUT ================= */
type FileInputProps = {
  label: string;
  file: File | null;
  setFile: (f: File | null) => void;
  onView: (f: File) => void;
  error?: string;
  required?: boolean;
  onError?: (msg: string) => void;
};

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

export function FileInput({ label, file, setFile, onView, error, required = true, onError }: FileInputProps) {
  const fileInputId = label.replace(/\s+/g, "-").toLowerCase();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (f.type !== "application/pdf") {
      onError?.("File harus berformat PDF");
      return;
    }

    if (f.size > MAX_FILE_SIZE) {
      onError?.("Ukuran file maksimal 2 MB");
      return;
    }

    setFile(f);
  };

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex items-center border rounded-md overflow-hidden bg-background">
        <label
          htmlFor={fileInputId}
          className="px-3 py-2 text-sm border-r bg-muted cursor-pointer hover:bg-muted/70"
        >
          Pilih File
        </label>
        <input
          id={fileInputId}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleChange}
        />
        <div className="flex-1 px-3 py-2 text-sm truncate text-muted-foreground">
          {file ? file.name : "Belum ada file"}
        </div>
        {file && (
          <div className="flex items-center gap-1 px-2">
            <button type="button" onClick={() => onView(file)} className="p-1 rounded hover:bg-muted" title="Lihat">
              <Eye className="w-4 h-4 text-primary" />
            </button>
            <button type="button" onClick={() => setFile(null)} className="p-1 rounded hover:bg-red-50" title="Hapus">
              <X className="w-4 h-4 text-red-500" />
            </button>
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <p className="text-xs text-muted-foreground">Format: <b>.pdf</b> | Max: <b>2MB</b></p>
    </div>
  );
}

/* ================= STATUS BADGE ================= */
type StatusBadgeProps = {
  status: "Draft" | "Diajukan" | "Disetujui" | "Ditolak";
};

const STATUS_STYLES: Record<StatusBadgeProps["status"], string> = {
  Draft: "bg-gray-600 text-white",
  Diajukan: "bg-blue-600 text-white",
  Disetujui: "bg-green-600 text-white",
  Ditolak: "bg-red-600 text-white",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[status]}`}>
      {status}
    </span>
  );
}

/* ================= PREVIEW MODAL ================= */
type PreviewModalProps = {
  file: File | null;
  onClose: () => void;
};

export function PreviewModal({ file, onClose }: PreviewModalProps) {
  if (!file) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl h-[80vh] flex flex-col">
        <div className="p-3 border-b flex justify-between items-center">
          <span className="text-sm font-medium">{file.name}</span>
          <button onClick={onClose} className="p-1 rounded hover:bg-muted">
            <X className="w-5 h-5" />
          </button>
        </div>
        <iframe src={URL.createObjectURL(file)} className="flex-1 w-full" />
      </div>
    </div>
  );
}
