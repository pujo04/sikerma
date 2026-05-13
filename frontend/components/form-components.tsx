import {
  Select as ShadcnSelect,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Eye, X } from "lucide-react";

/* ================= SECTION ================= */

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

export function Section({ title, children }: SectionProps) {
  return (
    <div className="rounded-lg border bg-card">
      <div className="px-4 py-2 border-b bg-muted/40 font-medium text-sm">
        {title}
      </div>
      <div className="p-4 space-y-4">{children}</div>
    </div>
  );
}

/* ================= INPUT ================= */

type InputProps = {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
};

export function Input({ label, type = "text", value, onChange, error, placeholder }: InputProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

/* ================= TEXTAREA ================= */

type TextareaProps = {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export function Textarea({ label, value, onChange }: TextareaProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <textarea
        value={value}
        onChange={onChange}
        className="w-full border rounded-md px-3 py-2 text-sm min-h-[90px]"
      />
    </div>
  );
}

/* ================= SELECT ================= */

type SelectProps = {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
};

export function Select({ label, options, value, onChange }: SelectProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <ShadcnSelect value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="- Pilih -" />
        </SelectTrigger>
        <SelectContent className="max-h-[200px] overflow-y-auto">
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </ShadcnSelect>
    </div>
  );
}

/* ================= MODAL INPUT ================= */

type ModalInputProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
};

export function ModalInput({ label, value, onChange, placeholder }: ModalInputProps) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium">
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
    </div>
  );
}

/* ================= FILE INPUT ================= */

type FileInputProps = {
  label: string;
  maxSizeMB: number;
  file: File | null;
  setFile: (f: File | null) => void;
  onView: (file: File) => void;
  onError?: (msg: string) => void;
};

export function FileInput({ label, maxSizeMB, file, setFile, onView, onError }: FileInputProps) {
  const fileInputId = label.replace(/\s+/g, "-").toLowerCase();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (f.type !== "application/pdf") {
      onError?.("File harus berformat PDF");
      return;
    }

    if (f.size > maxSizeMB * 1024 * 1024) {
      onError?.(`Ukuran file maksimal ${maxSizeMB} MB`);
      return;
    }

    setFile(f);
  };

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">
        {label} <span className="text-red-500">*</span>
      </label>

      <div className="flex items-center border rounded-md overflow-hidden bg-background">
        <label
          htmlFor={fileInputId}
          className="px-3 py-2 text-sm border-r bg-muted cursor-pointer hover:bg-muted/70"
        >
          Choose File
        </label>

        <input
          id={fileInputId}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleChange}
        />

        <div className="flex-1 px-3 py-2 text-sm truncate text-muted-foreground">
          {file ? file.name : "No file chosen"}
        </div>

        {file && (
          <div className="flex items-center gap-1 px-2">
            <button
              type="button"
              onClick={() => onView(file)}
              className="p-1 rounded hover:bg-muted"
              title="Lihat Dokumen"
            >
              <Eye className="w-4 h-4 text-primary" />
            </button>

            <button
              type="button"
              onClick={() => setFile(null)}
              className="p-1 rounded hover:bg-red-50"
              title="Hapus Dokumen"
            >
              <X className="w-4 h-4 text-red-500" />
            </button>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        File type: <b>.pdf</b> | Max size: <b>{maxSizeMB}MB</b>
      </p>
    </div>
  );
}

/* ================= TERMIN FORM ================= */

type TerminData = {
  bulan: string;
  tahun: string;
  jumlah: string;
};

type TerminFormProps = {
  title: string;
  data: TerminData;
  setData: (data: TerminData) => void;
};

export function TerminForm({ title, data, setData }: TerminFormProps) {
  return (
    <div className="space-y-2">
      <h5 className="text-sm font-medium">
        {title} <span className="text-muted-foreground">(Opsional)</span>
      </h5>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          label="Bulan"
          value={data.bulan}
          onChange={(v) => setData({ ...data, bulan: v })}
          options={[
            "Januari",
            "Februari",
            "Maret",
            "April",
            "Mei",
            "Juni",
            "Juli",
            "Agustus",
            "September",
            "Oktober",
            "November",
            "Desember",
          ]}
        />

        <Input
          label="Tahun"
          type="number"
          value={data.tahun}
          onChange={(v) => setData({ ...data, tahun: v })}
        />

        <Input
          label="Jumlah (Rp)"
          value={data.jumlah}
          onChange={(v) => setData({ ...data, jumlah: v })}
        />
      </div>
    </div>
  );
}

/* ================= FILE PREVIEW MODAL ================= */

type FilePreviewModalProps = {
  file: File | null;
  url: string | null;
  onClose: () => void;
};

export function FilePreviewModal({ file, url, onClose }: FilePreviewModalProps) {
  if (!file && !url) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black/70 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <p className="text-sm font-medium">
            {file?.name || "Dokumen Lama"}
          </p>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <iframe
          src={file ? URL.createObjectURL(file) : url || ""}
          className="flex-1 w-full"
        />
      </div>
    </div>
  );
}
