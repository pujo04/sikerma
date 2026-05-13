"use client";

import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { CloseButton } from "@/components/ui/close-button";
import { Section, Input, TerminForm, ModalInput } from "@/components/form-components";
import { TerminData, MouOption, PenggiatOption, DataPenggiatState, BentukKegiatanState } from "@/components/repository-form-types";

/* ================= TYPE ALIAS ================= */
type Option = string | { label: string; value: string | number };

/* ================= SECTION 1: MASA BERLAKU ================= */
export function SectionMasaBerlaku({
  statusDokumen,
  setStatusDokumen,
  tanggalMulai,
  setTanggalMulai,
  tanggalBerakhir,
  setTanggalBerakhir,
  statusOptions,
}: {
  statusDokumen: string;
  setStatusDokumen: (v: string | number) => void;
  tanggalMulai: string;
  setTanggalMulai: (v: string | number) => void;
  tanggalBerakhir: string;
  setTanggalBerakhir: (v: string | number) => void;
  statusOptions: Option[];
}) {
  return (
    <Section title="1. Masa Berlaku Dokumen">
      <SearchableSelect
        label="Status Dokumen"
        value={statusDokumen}
        onChange={setStatusDokumen}
        options={statusOptions}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Tanggal Mulai" type="date" value={tanggalMulai} onChange={setTanggalMulai} />
        <Input label="Tanggal Berakhir" type="date" value={tanggalBerakhir} onChange={setTanggalBerakhir} />
      </div>
    </Section>
  );
}

/* ================= SECTION 2: DOKUMEN KERJASAMA ================= */
export function SectionDokumenKerjasama({
  jenisDokumen,
  setJenisDokumen,
  nomorDokumen,
  setNomorDokumen,
  judulKerjasama,
  setJudulKerjasama,
  deskripsi,
  setDeskripsi,
  skalaKerjasama,
  setSkalaKerjasama,
  dasarDokumen,
  setDasarDokumen,
  mouList,
  jenisOptions,
  skalaOptions,
}: {
  jenisDokumen: string;
  setJenisDokumen: (v: string | number) => void;
  nomorDokumen: string;
  setNomorDokumen: (v: string | number) => void;
  judulKerjasama: string;
  setJudulKerjasama: (v: string | number) => void;
  deskripsi: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setDeskripsi: (e: any) => void;
  skalaKerjasama: string;
  setSkalaKerjasama: (v: string | number) => void;
  dasarDokumen: string;
  setDasarDokumen: (v: string | number) => void;
  mouList: MouOption[];
  jenisOptions: Option[];
  skalaOptions: Option[];
}) {
  const handleJenisChange = (v: string | number) => {
    setJenisDokumen(v);
    if (v === "MOU") setDasarDokumen("");
  };

  return (
    <Section title="2. Dokumen Kerjasama">
      <SearchableSelect
        label="Jenis Dokumen"
        value={jenisDokumen}
        onChange={handleJenisChange}
        options={jenisOptions}
      />
      <Input label="Nomor Dokumen" value={nomorDokumen} onChange={setNomorDokumen} />
      <Input label="Judul Kerjasama" value={judulKerjasama} onChange={setJudulKerjasama} />
      <div className="space-y-1">
        <label className="text-sm font-medium">Deskripsi Kegiatan</label>
        <textarea
          value={deskripsi}
          onChange={(e) => setDeskripsi(e)}
          className="w-full border rounded-md px-3 py-2 text-sm min-h-[90px] focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>
      {(jenisDokumen === "MOA" || jenisDokumen === "IA") && (
        <SearchableSelect
          label="Dasar Dokumen Kerjasama"
          value={dasarDokumen}
          onChange={setDasarDokumen}
          options={mouList}
        />
      )}
      <SearchableSelect
        label="Skala Kerjasama"
        value={skalaKerjasama}
        onChange={setSkalaKerjasama}
        options={skalaOptions}
      />
    </Section>
  );
}

/* ================= SECTION 3: FILE DOKUMEN ================= */
export function SectionFileDokumen({
  fileDokumen,
  setFileDokumen,
  fileKontrak,
  setFileKontrak,
  fileKAK,
  setFileKAK,
  fileRAB,
  setFileRAB,
  linkDokumen,
  setLinkDokumen,
  existingDokumen,
  setPreviewUrl,
  setPreviewFile,
  FileInputComponent,
  isLinkValid,
  isEditMode = false,
  onFileError,
}: {
  fileDokumen: File | null;
  setFileDokumen: (f: File | null) => void;
  fileKontrak: File | null;
  setFileKontrak: (f: File | null) => void;
  fileKAK: File | null;
  setFileKAK: (f: File | null) => void;
  fileRAB: File | null;
  setFileRAB: (f: File | null) => void;
  linkDokumen: string;
  setLinkDokumen: (v: string | number) => void;
  existingDokumen?: { id: number; jenis: string; filePath?: string }[];
  setPreviewUrl?: (u: string) => void;
  setPreviewFile?: (f: File) => void;
  FileInputComponent: any;
  isLinkValid: boolean;
  isEditMode?: boolean;
  onFileError?: (msg: string) => void;
}) {
  return (
    <Section title="3. File Dokumen">
      <div className="space-y-6">
        {/* DOKUMEN UTAMA */}
        <div className="rounded-md border p-4 bg-muted/20 space-y-4">
          <h4 className="text-sm font-semibold text-foreground">Dokumen Utama Kerjasama</h4>

          <FileInputComponent
            label="Upload Dokumen"
            maxSizeMB={5}
            file={fileDokumen}
            setFile={setFileDokumen}
            onView={setPreviewFile!}
            onError={onFileError}
          />

          {isEditMode && existingDokumen?.filter((d) => d.jenis === "utama" && d.filePath).map((d) => (
            <div
              key={d.id}
              className="text-sm text-blue-600 underline cursor-pointer mt-2"
              onClick={() => setPreviewUrl!(d.filePath!)}
            >
              Lihat Dokumen Lama
            </div>
          ))}

          <div className="space-y-1">
            <Input
              label="Link Dokumen"
              value={linkDokumen}
              onChange={setLinkDokumen}
              error={!isLinkValid ? "Link harus URL publik (http/https)" : ""}
            />
            <p className="text-xs text-muted-foreground">
              Gunakan link Google Drive / OneDrive (akses publik). Kosongkan jika Anda mengunggah file.
            </p>
          </div>
        </div>

        {/* DOKUMEN PENDUKUNG */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">Dokumen Pendukung</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FileInputComponent
                label="Upload Kontrak"
                maxSizeMB={2}
                file={fileKontrak}
                setFile={setFileKontrak}
                onView={setPreviewFile!}
                onError={onFileError}
              />
              {isEditMode && existingDokumen?.filter((d) => d.jenis === "kontrak" && d.filePath).map((d) => (
                <div
                  key={d.id}
                  className="text-sm text-blue-600 underline cursor-pointer mt-2"
                  onClick={() => setPreviewUrl!(d.filePath!)}
                >
                  Lihat Dokumen Lama
                </div>
              ))}
            </div>
            <div>
              <FileInputComponent
                label="Upload KAK"
                maxSizeMB={2}
                file={fileKAK}
                setFile={setFileKAK}
                onView={setPreviewFile!}
                onError={onFileError}
              />
              {isEditMode && existingDokumen?.filter((d) => d.jenis === "kak" && d.filePath).map((d) => (
                <div
                  key={d.id}
                  className="text-sm text-blue-600 underline cursor-pointer mt-2"
                  onClick={() => setPreviewUrl!(d.filePath!)}
                >
                  Lihat Dokumen Lama
                </div>
              ))}
            </div>
            <div>
              <FileInputComponent
                label="Upload RAB"
                maxSizeMB={2}
                file={fileRAB}
                setFile={setFileRAB}
                onView={setPreviewFile!}
                onError={onFileError}
              />
              {isEditMode && existingDokumen?.filter((d) => d.jenis === "rab" && d.filePath).map((d) => (
                <div
                  key={d.id}
                  className="text-sm text-blue-600 underline cursor-pointer mt-2"
                  onClick={() => setPreviewUrl!(d.filePath!)}
                >
                  Lihat Dokumen Lama
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ================= SECTION 4: UNIT PELAKSANA ================= */
export function SectionUnitPelaksana({ unitNama }: { unitNama: string }) {
  return (
    <Section title="4. Unit Pelaksana">
      <div className="p-3 rounded-md bg-muted/30 border border-dashed">
        <p className="text-sm font-medium text-foreground">{unitNama || "Memuat data..."}</p>
      </div>
    </Section>
  );
}

/* ================= SECTION 5: ANGGARAN + TERMIN ================= */
export function SectionAnggaran({
  sumberPendanaan,
  setSumberPendanaan,
  anggaran,
  setAnggaran,
  namaPenanggungJawab,
  setNamaPenanggungJawab,
  unitPenanggungJawab,
  setUnitPenanggungJawab,
  termin1,
  setTermin1,
  termin2,
  setTermin2,
  termin3,
  setTermin3,
  terminTitle,
  sumberOptions,
  unitOptions,
}: {
  sumberPendanaan: string;
  setSumberPendanaan: (v: string | number) => void;
  anggaran: string;
  setAnggaran: (v: string | number) => void;
  namaPenanggungJawab: string;
  setNamaPenanggungJawab: (v: string | number) => void;
  unitPenanggungJawab: string;
  setUnitPenanggungJawab: (v: string | number) => void;
  termin1: TerminData;
  setTermin1: (d: TerminData) => void;
  termin2: TerminData;
  setTermin2: (d: TerminData) => void;
  termin3: TerminData;
  setTermin3: (d: TerminData) => void;
  terminTitle?: string;
  sumberOptions: Option[];
  unitOptions: Option[];
}) {
  return (
    <Section title="5. Anggaran Kerjasama">
      <SearchableSelect
        label="Sumber Pendanaan"
        value={sumberPendanaan}
        onChange={setSumberPendanaan}
        options={sumberOptions}
      />
      <Input label="Jumlah Anggaran (Rp)" value={anggaran} onChange={setAnggaran} />
      <Input label="Nama Penanggung Jawab" value={namaPenanggungJawab} onChange={setNamaPenanggungJawab} />
      <SearchableSelect
        label="Unit Penanggung Jawab"
        value={unitPenanggungJawab}
        onChange={setUnitPenanggungJawab}
        options={unitOptions}
      />
      <div className="mt-6 space-y-6">
        <TerminForm title={terminTitle ? `${terminTitle} Termin 1` : "Rencana Pencairan Termin 1"} data={termin1} setData={setTermin1} />
        <TerminForm title={terminTitle ? `${terminTitle} Termin 2` : "Rencana Pencairan Termin 2"} data={termin2} setData={setTermin2} />
        <TerminForm title={terminTitle ? `${terminTitle} Termin 3` : "Rencana Pencairan Termin 3"} data={termin3} setData={setTermin3} />
      </div>
    </Section>
  );
}

/* ================= MODAL PENGGIAT ================= */
export function ModalPenggiat({
  open,
  onClose,
  editing,
  onSave,
  penggiat,
  setPenggiat,
  penggiatOptions,
}: {
  open: boolean;
  onClose: () => void;
  editing: any;
  onSave: () => void;
  penggiat: any;
  setPenggiat: (p: any) => void;
  penggiatOptions: PenggiatOption[];
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b shrink-0">
          <h3 className="text-sm font-semibold">Penggiat Kerjasama</h3>
          <CloseButton onClick={onClose} />
        </div>

        <div className="px-5 py-4 space-y-4 text-sm overflow-y-auto">
          <ModalInput label="Pihak Ke-#" placeholder="1, 2, 3, dst." value={penggiat.pihakKe} onChange={(v) => setPenggiat({ ...penggiat, pihakKe: v })} />
          <SearchableSelect label="Nama Instansi" size="xs" value={penggiat.penggiatId} onChange={(v) => setPenggiat({ ...penggiat, penggiatId: v })} options={penggiatOptions} />
          <ModalInput label="Nama Penandatangan" placeholder="nama pejabat" value={penggiat.namaPenandatangan} onChange={(v) => setPenggiat({ ...penggiat, namaPenandatangan: v })} />
          <ModalInput label="Jabatan Penandatangan" placeholder="jabatan" value={penggiat.jabatanPenandatangan} onChange={(v) => setPenggiat({ ...penggiat, jabatanPenandatangan: v })} />
          <ModalInput label="Nama Penanggungjawab" placeholder="nama penanggungjawab" value={penggiat.namaPenanggungJawab} onChange={(v) => setPenggiat({ ...penggiat, namaPenanggungJawab: v })} />
          <ModalInput label="Jabatan Penanggungjawab" placeholder="jabatan penanggungjawab" value={penggiat.jabatanPenanggungJawab} onChange={(v) => setPenggiat({ ...penggiat, jabatanPenanggungJawab: v })} />
          <ModalInput label="Email Penanggungjawab" placeholder="email penanggungjawab" value={penggiat.emailPenanggungJawab} onChange={(v) => setPenggiat({ ...penggiat, emailPenanggungJawab: v })} />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Note! Jika Nama Instansi penggiat tidak ada dalam database, silakan buat data baru di tombol <b>&quot;Penggiat Baru&quot;</b>.
          </p>
        </div>

        <div className="flex justify-end gap-2 px-6 py-4 border-t shrink-0 bg-background">
          <Button variant="destructive" size="sm" onClick={onClose}>Close</Button>
          <Button size="sm" onClick={onSave}>Save</Button>
        </div>
      </div>
    </div>
  );
}

/* ================= MODAL DATA PENGGIAT ================= */
export function ModalDataPenggiat({
  open,
  onClose,
  dataPenggiat,
  setDataPenggiat,
  klasifikasiOptions,
  bidangOptions,
  negaraOptions,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  dataPenggiat: DataPenggiatState;
  setDataPenggiat: (d: DataPenggiatState) => void;
  klasifikasiOptions: Option[];
  bidangOptions: Option[];
  negaraOptions: Option[];
  onSave: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b shrink-0">
          <h3 className="text-sm font-semibold">Data Penggiat Kerjasama</h3>
          <CloseButton onClick={onClose} />
        </div>

        <div className="px-5 py-4 space-y-4 text-sm overflow-y-auto">
          <SearchableSelect label="Klasifikasi Mitra Kerjasama" size="xs" options={klasifikasiOptions} value={dataPenggiat.klasifikasiMitra} onChange={(v) => setDataPenggiat({ ...dataPenggiat, klasifikasiMitra: v as string })} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ModalInput label="Nama Mitra" placeholder="nama mitra" value={dataPenggiat.namaMitra} onChange={(v) => setDataPenggiat({ ...dataPenggiat, namaMitra: v })} />
            <SearchableSelect label="Bidang Usaha" size="xs" options={bidangOptions} value={dataPenggiat.bidangUsaha} onChange={(v) => setDataPenggiat({ ...dataPenggiat, bidangUsaha: v as string })} />
            <SearchableSelect label="Negara" size="xs" options={negaraOptions} value={dataPenggiat.negara} onChange={(v) => setDataPenggiat({ ...dataPenggiat, negara: v as string })} />
            <ModalInput label="Provinsi" value={dataPenggiat.provinsi} placeholder="Provinsi" onChange={(v) => setDataPenggiat({ ...dataPenggiat, provinsi: v })} />
          </div>

          <ModalInput label="Alamat" placeholder="alamat lengkap" value={dataPenggiat.alamat} onChange={(v) => setDataPenggiat({ ...dataPenggiat, alamat: v })} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ModalInput label="NPWP" placeholder="npwp" value={dataPenggiat.npwp} onChange={(v) => setDataPenggiat({ ...dataPenggiat, npwp: v })} />
            <ModalInput label="No. Telp" placeholder="nomor telepon" value={dataPenggiat.noTelp} onChange={(v) => setDataPenggiat({ ...dataPenggiat, noTelp: v })} />
            <ModalInput label="No. Fax" placeholder="nomor fax" value={dataPenggiat.noFax} onChange={(v) => setDataPenggiat({ ...dataPenggiat, noFax: v })} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ModalInput label="Email" placeholder="email" value={dataPenggiat.email} onChange={(v) => setDataPenggiat({ ...dataPenggiat, email: v })} />
            <ModalInput label="URL Website" placeholder="https://" value={dataPenggiat.website} onChange={(v) => setDataPenggiat({ ...dataPenggiat, website: v })} />
          </div>
        </div>

        <div className="flex justify-end gap-2 px-6 py-4 border-t shrink-0 bg-background">
          <Button variant="destructive" size="sm" onClick={onClose}>Close</Button>
          <Button size="sm" onClick={onSave}>Save</Button>
        </div>
      </div>
    </div>
  );
}

/* ================= MODAL BENTUK KEGIATAN ================= */
export function ModalBentukKegiatan({
  open,
  onClose,
  editing,
  bentuk,
  setBentuk,
  onSave,
  bentukOptions,
  sasaranOptions,
  indikatorOptions,
}: {
  open: boolean;
  onClose: () => void;
  editing: any;
  bentuk: BentukKegiatanState;
  setBentuk: (b: BentukKegiatanState) => void;
  onSave: () => void;
  bentukOptions: Option[];
  sasaranOptions: Option[];
  indikatorOptions: Option[];
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b shrink-0">
          <h3 className="text-sm font-semibold">Bentuk Kegiatan</h3>
          <CloseButton onClick={onClose} />
        </div>

        <div className="px-5 py-4 space-y-4 text-sm overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SearchableSelect label="Bentuk Kegiatan" size="xs" value={bentuk.bentuk} options={bentukOptions} onChange={(v) => setBentuk({ ...bentuk, bentuk: v as string })} />
            <ModalInput label="Penerimaan Anggaran" placeholder="Rp..." value={bentuk.penerimaan} onChange={(v) => setBentuk({ ...bentuk, penerimaan: v })} />
            <ModalInput label="Volume Kegiatan" placeholder="volume" value={bentuk.volume} onChange={(v) => setBentuk({ ...bentuk, volume: v })} />
            <ModalInput label="Satuan" placeholder="satuan kegiatan" value={bentuk.satuan} onChange={(v) => setBentuk({ ...bentuk, satuan: v })} />
            <SearchableSelect label="Sasaran" size="xs" value={bentuk.sasaran} options={sasaranOptions} onChange={(v) => setBentuk({ ...bentuk, sasaran: v as string })} />
            <SearchableSelect label="Indikator" size="xs" required={false} value={bentuk.indikator} options={indikatorOptions} onChange={(v) => setBentuk({ ...bentuk, indikator: v as string })} />
          </div>
          <div>
            <label className="text-xs font-medium">Keterangan</label>
            <textarea
              placeholder="keterangan"
              value={bentuk.keterangan}
              onChange={(e) => setBentuk({ ...bentuk, keterangan: e.target.value })}
              className="w-full border rounded-md px-3 py-2 text-sm min-h-[90px] focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 px-6 py-4 border-t shrink-0 bg-background">
          <Button variant="destructive" size="sm" onClick={onClose}>Close</Button>
          <Button size="sm" onClick={onSave}>Save</Button>
        </div>
      </div>
    </div>
  );
}

/* ================= SECTION PENGGIAT KERJASAMA ================= */
export function SectionPenggiatKerjasama({
  penggiatList,
  setPenggiatList,
  editingPenggiat,
  setEditingPenggiat,
  openPenggiat,
  setOpenPenggiat,
  openDataPenggiat,
  setOpenDataPenggiat,
  onAddPenggiat,
  getNamaInstansi,
  setPenggiat,
  onDeletePenggiat,
}: {
  penggiatList: any[];
  setPenggiatList: any;
  editingPenggiat: any;
  setEditingPenggiat: any;
  openPenggiat: boolean;
  setOpenPenggiat: any;
  openDataPenggiat: boolean;
  setOpenDataPenggiat: any;
  onAddPenggiat: () => void;
  getNamaInstansi: (id: string) => string;
  setPenggiat: (p: any) => void;
  onDeletePenggiat?: (p: any) => void;
}) {
  return (
    <Section title="6. Penggiat Kerjasama">
      <div className="flex gap-2 mb-4">
        <Button size="sm" variant="outline" onClick={() => { setEditingPenggiat(null); onAddPenggiat(); setOpenPenggiat(true); }}>
          + Tambah Penggiat
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setOpenDataPenggiat(true)}>
          + Penggiat Baru
        </Button>
      </div>

      <div className="space-y-3">
        {penggiatList.length === 0 && (
          <p className="text-sm text-muted-foreground">Belum ada penggiat ditambahkan</p>
        )}
        {penggiatList.map((p) => (
          <div key={p.id} className="border rounded-md bg-white">
            <button
              className="w-full flex justify-between items-center px-4 py-3 text-sm font-medium"
              onClick={() => setPenggiatList((prev: any[]) => prev.map((x) => x.id === p.id ? { ...x, open: !x.open } : x))}
            >
              <span># Pihak Ke-{p.pihakKe} {getNamaInstansi(p.penggiatId)}</span>
              <span>{p.open ? "▲" : "▼"}</span>
            </button>
            {p.open && (
              <div className="px-4 pb-4 space-y-3 text-sm">
                <div className="bg-purple-50 border rounded-md p-3">
                  <p className="text-xs text-muted-foreground">Pejabat Penandatangan</p>
                  <p className="font-medium">{p.namaPenandatangan} ({p.jabatanPenandatangan})</p>
                </div>
                <div className="bg-blue-50 border rounded-md p-3">
                  <p className="text-xs text-muted-foreground">Penanggung Jawab</p>
                  <p>{p.namaPenanggungJawab || "-"}</p>
                </div>
                <div className="bg-green-50 border rounded-md p-3">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p>{p.emailPenanggungJawab || "-"}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => { setPenggiat(p); setEditingPenggiat(p); setOpenPenggiat(true); }}>
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="hover:bg-red-600 hover:text-white" onClick={() => onDeletePenggiat ? onDeletePenggiat(p) : setPenggiatList((prev: any[]) => prev.filter((x: any) => x.id !== p.id))}>
                    Hapus
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ================= SECTION BENTUK KEGIATAN ================= */
export function SectionBentukKegiatan({
  bentukKegiatanList,
  setBentukKegiatanList,
  editingBentuk,
  setEditingBentuk,
  openBentukKegiatan,
  setOpenBentukKegiatan,
  bentuk,
  setBentuk,
  onDeleteBentuk,
}: {
  bentukKegiatanList: any[];
  setBentukKegiatanList: any;
  editingBentuk: any;
  setEditingBentuk: any;
  openBentukKegiatan: boolean;
  setOpenBentukKegiatan: any;
  bentuk: BentukKegiatanState;
  setBentuk: (b: BentukKegiatanState) => void;
  onDeleteBentuk?: (b: any) => void;
}) {
  return (
    <Section title="7. Bentuk Kegiatan">
      <Button size="sm" variant="outline" onClick={() => { setEditingBentuk(null); setOpenBentukKegiatan(true); }}>
        + Tambah Bentuk
      </Button>

      <div className="space-y-3 mt-4">
        {bentukKegiatanList.map((b) => (
          <div key={b.id} className="border rounded-md bg-white">
            <button
              className="w-full flex justify-between items-center px-4 py-3 text-sm font-medium"
              onClick={() => setBentukKegiatanList((prev: any[]) => prev.map((x) => x.id === b.id ? { ...x, open: !x.open } : x))}
            >
              <span>{b.bentuk}</span>
              <span>{b.open ? "▲" : "▼"}</span>
            </button>
            {b.open && (
              <div className="px-4 pb-4 space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 border rounded-md p-3"><p className="text-xs text-muted-foreground">Sasaran</p><p>{b.sasaran}</p></div>
                  <div className="bg-purple-50 border rounded-md p-3"><p className="text-xs text-muted-foreground">Indikator</p><p>{b.indikator || "-"}</p></div>
                  <div className="bg-green-50 border rounded-md p-3"><p className="text-xs text-muted-foreground">Volume</p><p>{b.volume} {b.satuan}</p></div>
                  <div className="bg-yellow-50 border rounded-md p-3"><p className="text-xs text-muted-foreground">Anggaran</p><p>{b.penerimaan || "-"}</p></div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => { setBentuk({ bentuk: b.bentuk, penerimaan: b.penerimaan || "", volume: b.volume || "", satuan: b.satuan || "", sasaran: b.sasaran, indikator: b.indikator || "", keterangan: b.keterangan || "" }); setEditingBentuk(b); setOpenBentukKegiatan(true); }}>
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="hover:bg-red-600 hover:text-white" onClick={() => onDeleteBentuk ? onDeleteBentuk(b) : setBentukKegiatanList((prev: any[]) => prev.filter((x: any) => x.id !== b.id))}>
                    Hapus
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}
