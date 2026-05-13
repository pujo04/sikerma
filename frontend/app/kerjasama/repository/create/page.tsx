"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { FileInput } from "@/components/form-components";
import { ErrorModal } from "@/components/modal";
import API from "@/lib/api-config";
import {
  SectionMasaBerlaku,
  SectionDokumenKerjasama,
  SectionFileDokumen,
  SectionUnitPelaksana,
  SectionAnggaran,
  SectionPenggiatKerjasama,
  SectionBentukKegiatan,
  ModalPenggiat,
  ModalDataPenggiat,
  ModalBentukKegiatan,
} from "@/components/repository-form-shell";
import {
  STATUS_DOKUMEN_OPTIONS,
  JENIS_DOKUMEN_OPTIONS,
  SKALA_KERJASAMA_OPTIONS,
  SUMBER_PENDANAAN_OPTIONS,
  UNIT_PENANGGUNG_JAWAB_OPTIONS,
  BIDANG_USAHA_OPTIONS,
  NEGARA_OPTIONS,
  KLASIFIKASI_MITRA_OPTIONS,
  BENTUK_KEGIATAN_OPTIONS,
  SASARAN_OPTIONS,
  INDIKATOR_OPTIONS,
} from "@/components/constants";
import { TerminData, MouOption, PenggiatOption, DataPenggiatState, BentukKegiatanState } from "@/components/repository-form-types";

/* ================= PAGE ================= */
export default function CreateRepositoryPage() {
  const router = useRouter();
  useEffect(() => { document.title = "SIKERMA - Repository"; }, []);

  /* ===== UI STATE ===== */
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);
  const [unitNama, setUnitNama] = useState<string>("");
  const [fileError, setFileError] = useState<string | null>(null);

  /* ===== FORM STATE ===== */
  const [statusDokumen, setStatusDokumen] = useState("");
  const [jenisDokumen, setJenisDokumen] = useState("");
  const [dasarDokumen, setDasarDokumen] = useState("");
  const [mouList, setMouList] = useState<MouOption[]>([]);
  const [skalaKerjasama, setSkalaKerjasama] = useState("");
  const [sumberPendanaan, setSumberPendanaan] = useState("");
  const [unitPenanggungJawab, setUnitPenanggungJawab] = useState("");
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalBerakhir, setTanggalBerakhir] = useState("");
  const [nomorDokumen, setNomorDokumen] = useState("");
  const [judulKerjasama, setJudulKerjasama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [anggaran, setAnggaran] = useState("");
  const [namaPenanggungJawab, setNamaPenanggungJawab] = useState("");
  const [termin1, setTermin1] = useState<TerminData>({ bulan: "", tahun: "", jumlah: "" });
  const [termin2, setTermin2] = useState<TerminData>({ bulan: "", tahun: "", jumlah: "" });
  const [termin3, setTermin3] = useState<TerminData>({ bulan: "", tahun: "", jumlah: "" });

  /* ===== FILE STATE ===== */
  const [fileDokumen, setFileDokumen] = useState<File | null>(null);
  const [fileKontrak, setFileKontrak] = useState<File | null>(null);
  const [fileKAK, setFileKAK] = useState<File | null>(null);
  const [fileRAB, setFileRAB] = useState<File | null>(null);
  const [linkDokumen, setLinkDokumen] = useState("");
  const [previewFile, setPreviewFile] = useState<File | null>(null);

  /* ===== PENGGIAT STATE ===== */
  const [penggiatOptions, setPenggiatOptions] = useState<PenggiatOption[]>([]);
  const [penggiatList, setPenggiatList] = useState<any[]>([]);
  const [editingPenggiat, setEditingPenggiat] = useState<any | null>(null);
  const [openPenggiat, setOpenPenggiat] = useState(false);
  const [openDataPenggiat, setOpenDataPenggiat] = useState(false);
  const [penggiat, setPenggiat] = useState({
    pihakKe: "", penggiatId: "", namaPenandatangan: "", jabatanPenandatangan: "",
    namaPenanggungJawab: "", jabatanPenanggungJawab: "", emailPenanggungJawab: "",
  });
  const [dataPenggiat, setDataPenggiat] = useState<DataPenggiatState>({
    klasifikasiMitra: "", namaMitra: "", bidangUsaha: "", negara: "", provinsi: "",
    alamat: "", npwp: "", noTelp: "", noFax: "", email: "", website: "",
  });

  /* ===== BENTUK KEGIATAN STATE ===== */
  const [bentukKegiatanList, setBentukKegiatanList] = useState<any[]>([]);
  const [editingBentuk, setEditingBentuk] = useState<any | null>(null);
  const [openBentukKegiatan, setOpenBentukKegiatan] = useState(false);
  const [bentukKegiatan, setBentukKegiatan] = useState<BentukKegiatanState>({
    bentuk: "", penerimaan: "", volume: "", satuan: "", sasaran: "", indikator: "", keterangan: "",
  });

  /* ===== HELPERS ===== */
  const getNamaInstansi = (id: string) => penggiatOptions.find((p) => p.value === id)?.label || "-";

  const mapStatusRepository = (v: string) => {
    if (v === "Aktif") return "Aktif";
    if (v === "Kadaluarsa") return "Kadaluarsa";
    if (v === "DalamPerpanjangan") return "DalamPerpanjangan";
    return "TidakAktif";
  };

  const mapJenisDokumen = (v: string) => {
    if (v.startsWith("MoU")) return "MOU";
    if (v.startsWith("MoA")) return "MOA";
    return "IA";
  };

  const resetFormPenggiat = () => {
    setPenggiat({ pihakKe: "", penggiatId: "", namaPenandatangan: "", jabatanPenandatangan: "", namaPenanggungJawab: "", jabatanPenanggungJawab: "", emailPenanggungJawab: "" });
    setEditingPenggiat(null);
  };

  const resetFormDataPenggiat = () => {
    setDataPenggiat({ klasifikasiMitra: "", namaMitra: "", bidangUsaha: "", negara: "", provinsi: "", alamat: "", npwp: "", noTelp: "", noFax: "", email: "", website: "" });
  };

  const resetFormBentuk = () => {
    setBentukKegiatan({ bentuk: "", penerimaan: "", volume: "", satuan: "", sasaran: "", indikator: "", keterangan: "" });
    setEditingBentuk(null);
  };

  /* ===== USEEFFECTS ===== */
  useEffect(() => {
    if (showSuccess) {
      const t = setTimeout(() => router.replace("/kerjasama/repository"), 1500);
      return () => clearTimeout(t);
    }
  }, [showSuccess]);

  useEffect(() => {
    fetch(API.repositoryMou).then((r) => r.json()).then((data) => {
      if (!Array.isArray(data)) return;
      setMouList(data.map((m: any) => ({ value: m.id, label: `${m.nomorDokumen || "-"} - ${m.judulKerjasama}` })));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    fetch(API.penggiat).then(async (res) => {
      if (!res.ok) return [];
      const text = await res.text();
      return text ? JSON.parse(text) : [];
    }).then((data) => {
      if (!Array.isArray(data)) return;
      setPenggiatOptions(data.map((p: any) => ({ label: p.namaInstansi, value: p.id.toString() })));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    fetch(API.me, { cache: "no-store", credentials: "include" }).then(async (res) => {
      if (!res.ok) { setUnitNama("-"); return; }
      const userData = await res.json();
      setUnitNama(userData.role === "SUB_UNIT" ? userData.subUnit?.nama ?? "-" : userData.unit?.nama ?? "-");
    }).catch(() => setUnitNama("-"));
  }, []);

  /* ===== UPLOAD ===== */
  const upload = async (file: File | null, jenis: string, repoId: string) => {
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("repositoryId", repoId);
    fd.append("jenis", jenis);
    const res = await fetch(API.repositoryUpload, { method: "POST", body: fd });
    if (!res.ok) throw new Error("Upload gagal");
  };

  /* ===== HANDLES ===== */
  const handleSaveDataPenggiat = async () => {
    const res = await fetch(API.penggiat, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ namaInstansi: dataPenggiat.namaMitra, klasifikasiMitra: dataPenggiat.klasifikasiMitra, bidangUsaha: dataPenggiat.bidangUsaha, negara: dataPenggiat.negara, provinsi: dataPenggiat.provinsi, alamat: dataPenggiat.alamat, npwp: dataPenggiat.npwp, noTelp: dataPenggiat.noTelp, noFax: dataPenggiat.noFax, email: dataPenggiat.email, website: dataPenggiat.website }),
    });
    if (!res.ok) { alert("Gagal menyimpan penggiat"); return; }
    const fresh = await fetch(API.penggiat).then((r) => r.json());
    setPenggiatOptions(fresh.map((p: any) => ({ label: p.namaInstansi, value: String(p.id) })));
    resetFormDataPenggiat();
    setOpenDataPenggiat(false);
  };

  const handleSavePenggiatModal = () => {
    if (editingPenggiat) {
      setPenggiatList((prev) => prev.map((p) => p.id === editingPenggiat.id ? { ...penggiat, id: p.id } : p));
    } else {
      setPenggiatList((prev) => [...prev, { ...penggiat, id: Date.now() }]);
    }
    resetFormPenggiat();
    setOpenPenggiat(false);
  };

  const handleSaveBentukModal = () => {
    if (editingBentuk) {
      setBentukKegiatanList((prev) => prev.map((b) => b.id === editingBentuk.id ? { ...bentukKegiatan, id: b.id } : b));
    } else {
      setBentukKegiatanList((prev) => [...prev, { ...bentukKegiatan, id: Date.now() }]);
    }
    resetFormBentuk();
    setOpenBentukKegiatan(false);
  };

  /* ===== VALIDATION ===== */
  const isLinkValid = !linkDokumen || /^https?:\/\/.+/i.test(linkDokumen);
  const canSave = agree;

  /* ===== WRAPPERS ===== */
  const wrapDeskripsi = (e: React.ChangeEvent<HTMLTextAreaElement>) => setDeskripsi(e.target.value);
  const setBentuk = (b: BentukKegiatanState) => setBentukKegiatan(b);

  /* ===== SUBMIT ===== */
  const handleSave = async () => {
    if (!canSave || loading) return;
    try {
      setLoading(true);
      const res = await fetch(API.repository, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          statusDokumen: mapStatusRepository(statusDokumen), tanggalMulai, tanggalBerakhir,
          jenisDokumen: mapJenisDokumen(jenisDokumen), dasarDokumen: dasarDokumen || null,
          nomorDokumen, judulKerjasama, deskripsi, skalaKerjasama, sumberPendanaan,
          jumlahAnggaran: anggaran ? Number(anggaran) : null, unitPenanggungJawab, namaPenanggungJawab,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      const repoId = json.id ?? json.data?.id;

      await Promise.all([
        ...penggiatList.map((p) => fetch(API.repositoryPenggiat, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ repositoryId: repoId.toString(), penggiatId: p.penggiatId, pihakKe: p.pihakKe, namaPenandatangan: p.namaPenandatangan, jabatanPenandatangan: p.jabatanPenandatangan, namaPenanggungJawab: p.namaPenanggungJawab, jabatanPenanggungJawab: p.jabatanPenanggungJawab, emailPenanggungJawab: p.emailPenanggungJawab }) })),
        ...bentukKegiatanList.map((b) => fetch(API.repositoryBentukKegiatan, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ repositoryId: repoId.toString(), ...b }) })),
      ]);

      const terminList = [{ terminKe: 1, ...termin1 }, { terminKe: 2, ...termin2 }, { terminKe: 3, ...termin3 }].filter((t) => t.bulan && t.tahun && t.jumlah);
      await Promise.all(terminList.map((t) => fetch(API.repositoryTermin, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ repositoryId: repoId.toString(), ...t }) })));

      await Promise.allSettled([
        upload(fileDokumen, "utama", repoId), upload(fileKontrak, "kontrak", repoId),
        upload(fileKAK, "kak", repoId), upload(fileRAB, "rab", repoId),
      ]);

      setShowSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan repository");
    } finally {
      setLoading(false);
    }
  };

  /* ===== RENDER ===== */
  return (
    <div className="min-h-screen bg-background">
      <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} onExpandChange={setSidebarExpanded} />
      <div className={cn("relative transition-all duration-300", sidebarExpanded ? "md:ml-64" : "md:ml-[72px]")}>
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-xl md:text-2xl font-bold">Create Repository</h1>
              <Button variant="destructive" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <SectionMasaBerlaku statusDokumen={statusDokumen} setStatusDokumen={setStatusDokumen as any} tanggalMulai={tanggalMulai} setTanggalMulai={setTanggalMulai as any} tanggalBerakhir={tanggalBerakhir} setTanggalBerakhir={setTanggalBerakhir as any} statusOptions={STATUS_DOKUMEN_OPTIONS} />
                <SectionDokumenKerjasama jenisDokumen={jenisDokumen} setJenisDokumen={setJenisDokumen as any} nomorDokumen={nomorDokumen} setNomorDokumen={setNomorDokumen as any} judulKerjasama={judulKerjasama} setJudulKerjasama={setJudulKerjasama as any} deskripsi={deskripsi} setDeskripsi={wrapDeskripsi} skalaKerjasama={skalaKerjasama} setSkalaKerjasama={setSkalaKerjasama as any} dasarDokumen={dasarDokumen} setDasarDokumen={setDasarDokumen as any} mouList={mouList} jenisOptions={JENIS_DOKUMEN_OPTIONS} skalaOptions={SKALA_KERJASAMA_OPTIONS} />
                <SectionFileDokumen fileDokumen={fileDokumen} setFileDokumen={setFileDokumen} fileKontrak={fileKontrak} setFileKontrak={setFileKontrak} fileKAK={fileKAK} setFileKAK={setFileKAK} fileRAB={fileRAB} setFileRAB={setFileRAB} linkDokumen={linkDokumen} setLinkDokumen={setLinkDokumen as any} FileInputComponent={FileInput} isLinkValid={isLinkValid} setPreviewUrl={() => {}} setPreviewFile={setPreviewFile} onFileError={setFileError} />
              </div>
              <div className="space-y-6">
                <SectionUnitPelaksana unitNama={unitNama} />
                <SectionAnggaran sumberPendanaan={sumberPendanaan} setSumberPendanaan={setSumberPendanaan as any} anggaran={anggaran} setAnggaran={setAnggaran as any} namaPenanggungJawab={namaPenanggungJawab} setNamaPenanggungJawab={setNamaPenanggungJawab as any} unitPenanggungJawab={unitPenanggungJawab} setUnitPenanggungJawab={setUnitPenanggungJawab as any} termin1={termin1} setTermin1={setTermin1} termin2={termin2} setTermin2={setTermin2} termin3={termin3} setTermin3={setTermin3} sumberOptions={SUMBER_PENDANAAN_OPTIONS} unitOptions={UNIT_PENANGGUNG_JAWAB_OPTIONS} />
                <SectionPenggiatKerjasama penggiatList={penggiatList} setPenggiatList={setPenggiatList} editingPenggiat={editingPenggiat} setEditingPenggiat={setEditingPenggiat} openPenggiat={openPenggiat} setOpenPenggiat={setOpenPenggiat} openDataPenggiat={openDataPenggiat} setOpenDataPenggiat={setOpenDataPenggiat} onAddPenggiat={() => setPenggiat({ pihakKe: "", penggiatId: "", namaPenandatangan: "", jabatanPenandatangan: "", namaPenanggungJawab: "", jabatanPenanggungJawab: "", emailPenanggungJawab: "" })} getNamaInstansi={getNamaInstansi} setPenggiat={setPenggiat} onDeletePenggiat={(p) => setPenggiatList((prev) => prev.filter((x) => x.id !== p.id))} />
                <SectionBentukKegiatan bentukKegiatanList={bentukKegiatanList} setBentukKegiatanList={setBentukKegiatanList} editingBentuk={editingBentuk} setEditingBentuk={setEditingBentuk} openBentukKegiatan={openBentukKegiatan} setOpenBentukKegiatan={setOpenBentukKegiatan} bentuk={bentukKegiatan} setBentuk={setBentuk} onDeleteBentuk={(b) => setBentukKegiatanList((prev) => prev.filter((x) => x.id !== b.id))} />
              </div>
            </div>

            <div className="border-t pt-8 space-y-6">
              <div className="flex justify-center">
                <label className="flex items-start gap-3 text-sm max-w-2xl text-center">
                  <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1" />
                  <span className="leading-relaxed">Saya menyatakan dengan sesungguhnya bahwa seluruh data yang disampaikan adalah benar dan sesuai dokumen asli.</span>
                </label>
              </div>
              <div className="flex justify-center">
                <Button className="px-10" disabled={!canSave || loading} onClick={handleSave}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Save
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {previewFile && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl h-[80vh] flex flex-col shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="text-sm font-semibold">Preview Dokumen</h3>
              <button onClick={() => setPreviewFile(null)}><X className="w-5 h-5" /></button>
            </div>
            <iframe src={URL.createObjectURL(previewFile)} className="w-full flex-1" />
          </div>
        </div>
      )}

      <ModalPenggiat open={openPenggiat} onClose={() => { setOpenPenggiat(false); resetFormPenggiat(); }} editing={editingPenggiat} onSave={handleSavePenggiatModal} penggiat={penggiat} setPenggiat={setPenggiat} penggiatOptions={penggiatOptions} />
      <ModalDataPenggiat open={openDataPenggiat} onClose={() => setOpenDataPenggiat(false)} dataPenggiat={dataPenggiat} setDataPenggiat={setDataPenggiat} klasifikasiOptions={KLASIFIKASI_MITRA_OPTIONS} bidangOptions={BIDANG_USAHA_OPTIONS} negaraOptions={NEGARA_OPTIONS} onSave={handleSaveDataPenggiat} />
      <ModalBentukKegiatan open={openBentukKegiatan} onClose={() => { setOpenBentukKegiatan(false); resetFormBentuk(); }} editing={editingBentuk} bentuk={bentukKegiatan} setBentuk={setBentuk} onSave={handleSaveBentukModal} bentukOptions={BENTUK_KEGIATAN_OPTIONS} sasaranOptions={SASARAN_OPTIONS} indikatorOptions={INDIKATOR_OPTIONS} />

      {showSuccess && (
        <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 text-center space-y-4 w-full max-w-sm">
            <div className="text-green-600 text-4xl">✔</div>
            <h3 className="text-base font-semibold">Repository Berhasil Ditambahkan</h3>
            <p className="text-sm text-muted-foreground">Data repository kerjasama telah berhasil disimpan.</p>
            <Button onClick={() => { setShowSuccess(false); router.replace("/kerjasama/repository"); }} className="w-full">OK</Button>
          </div>
        </div>
      )}

      <ErrorModal
        open={!!fileError}
        onClose={() => setFileError(null)}
        message={fileError ?? ""}
      />
    </div>
  );
}
