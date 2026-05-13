/* ================= SHARED REPOSITORY FORM TYPES ================= */

export type TerminData = {
  bulan: string;
  tahun: string;
  jumlah: string;
};

export type MouOption = { value: string; label: string };
export type PenggiatOption = { label: string; value: string };
export type KontrakOption = { label: string; value: string };

export type PenggiatFormState = {
  pihakKe: string;
  penggiatId: string;
  namaPenandatangan: string;
  jabatanPenandatangan: string;
  namaPenanggungJawab: string;
  jabatanPenanggungJawab: string;
  emailPenanggungJawab: string;
};

export type DataPenggiatState = {
  klasifikasiMitra: string;
  namaMitra: string;
  bidangUsaha: string;
  negara: string;
  provinsi: string;
  alamat: string;
  npwp: string;
  noTelp: string;
  noFax: string;
  email: string;
  website: string;
};

export type BentukKegiatanState = {
  bentuk: string;
  penerimaan: string;
  volume: string;
  satuan: string;
  sasaran: string;
  indikator: string;
  keterangan: string;
};

export type PenggiatListItem = {
  id: number;
  pihakKe: string;
  penggiatId: string;
  namaPenandatangan: string;
  jabatanPenandatangan: string;
  namaPenanggungJawab: string;
  jabatanPenanggungJawab: string;
  emailPenanggungJawab: string;
  open?: boolean;
};

export type BentukListItem = {
  id: number;
  bentuk: string;
  penerimaan: string;
  volume: string;
  satuan: string;
  sasaran: string;
  indikator: string;
  keterangan: string;
  open?: boolean;
};

export type ExistingDokumen = {
  id: number;
  jenis: string;
  filePath?: string;
  linkUrl?: string;
};