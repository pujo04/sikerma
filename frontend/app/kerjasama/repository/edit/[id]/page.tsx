"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { ArrowLeft, Save, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { FileInput, Textarea } from "@/components/form-components";
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
export default function EditRepositoryPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  useEffect(() => { document.title = "SIKERMA - Repository"; }, []);

  /* ===== UI STATE ===== */
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  const [showUpdateError, setShowUpdateError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [unitNama, setUnitNama] = useState<string>("");
  const [agree, setAgree] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  /* ===== KONFIRMASI HAPUS ===== */
  const [deleteTarget, setDeleteTarget] = useState<{ type: "penggiat" | "bentuk"; item: any } | null>(null);

  /* ===== SUCCESS MODAL ===== */
  const [successModal, setSuccessModal] = useState<{ title: string; message: string } | null>(null);

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
  const [existingDokumen, setExistingDokumen] = useState<any[]>([]);
  const [linkDokumen, setLinkDokumen] = useState("");
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  /* ===== PENGGIAT STATE ===== */
  const [penggiatOptions, setPenggiatOptions] = useState<PenggiatOption[]>([]);
  const [originalPenggiat, setOriginalPenggiat] = useState<any[]>([]);
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
  const [originalBentuk, setOriginalBentuk] = useState<any[]>([]);
  const [bentukKegiatanList, setBentukKegiatanList] = useState<any[]>([]);
  const [editingBentuk, setEditingBentuk] = useState<any | null>(null);
  const [openBentukKegiatan, setOpenBentukKegiatan] = useState(false);
  const [bentukKegiatan, setBentukKegiatan] = useState<BentukKegiatanState>({
    bentuk: "", penerimaan: "", volume: "", satuan: "", sasaran: "", indikator: "", keterangan: "",
  });

  /* ===== HELPERS ===== */
  const getNamaInstansi = (id: string) => penggiatOptions.find((p) => p.value === id)?.label || "-";

  const resetFormDataPenggiat = () => {
    setDataPenggiat({ klasifikasiMitra: "", namaMitra: "", bidangUsaha: "", negara: "", provinsi: "", alamat: "", npwp: "", noTelp: "", noFax: "", email: "", website: "" });
  };

  const resetFormBentuk = () => {
    setBentukKegiatan({ bentuk: "", penerimaan: "", volume: "", satuan: "", sasaran: "", indikator: "", keterangan: "" });
    setEditingBentuk(null);
  };

  /* ===== WRAPPERS ===== */
  const wrapDeskripsi = (e: React.ChangeEvent<HTMLTextAreaElement>) => setDeskripsi(e.target.value);
  const setBentuk = (b: BentukKegiatanState) => setBentukKegiatan(b);

  /* ===== USEEFFECTS ===== */
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

  useEffect(() => {
    fetch(API.me, { cache: "no-store", credentials: "include" }).then(async (res) => {
      if (!res.ok) { setUnitNama("-"); return; }
      const userData = await res.json();
      setUnitNama(userData.role === "SUB_UNIT" ? userData.subUnit?.nama ?? "-" : userData.unit?.nama ?? "-");
    }).catch(() => setUnitNama("-"));
  }, []);

  useEffect(() => {
    if (!id) return;
    if (!/^\d+$/.test(id)) { setShowUpdateSuccess(true); setTimeout(() => router.push("/kerjasama/my-data"), 2000); return; }

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await fetch(API.repositoryDetail(id));
        if (!res.ok) throw new Error("Gagal mengambil data");
        const data = await res.json();

        setStatusDokumen(data.statusDokumen);
        setJenisDokumen(data.jenisDokumen);
        setSkalaKerjasama(data.skalaKerjasama);
        setSumberPendanaan(data.sumberPendanaan);
        setUnitPenanggungJawab(data.unitPenanggungJawab);
        setNamaPenanggungJawab(data.namaPenanggungJawab || "");
        setTanggalMulai(data.tanggalMulai?.slice(0, 10));
        setTanggalBerakhir(data.tanggalBerakhir?.slice(0, 10));
        setNomorDokumen(data.nomorDokumen);
        setJudulKerjasama(data.judulKerjasama);
        setDeskripsi(data.deskripsi || "");
        setDasarDokumen(data.dasarDokumen || "");
        setAnggaran(data.jumlahAnggaran?.toString() || "");

        if (data.termin?.length) {
          const t1 = data.termin.find((t: any) => t.terminKe === 1);
          const t2 = data.termin.find((t: any) => t.terminKe === 2);
          const t3 = data.termin.find((t: any) => t.terminKe === 3);
          if (t1) setTermin1({ bulan: t1.bulan || "", tahun: t1.tahun?.toString() || "", jumlah: t1.jumlah?.toString() || "" });
          if (t2) setTermin2({ bulan: t2.bulan || "", tahun: t2.tahun?.toString() || "", jumlah: t2.jumlah?.toString() || "" });
          if (t3) setTermin3({ bulan: t3.bulan || "", tahun: t3.tahun?.toString() || "", jumlah: t3.jumlah?.toString() || "" });
        }

        if (data.penggiat) {
          setOriginalPenggiat(data.penggiat);
          setPenggiatList(data.penggiat.map((p: any) => ({
            id: p.id, pihakKe: p.pihakKe, penggiatId: p.penggiatId?.toString() || "",
            namaPenandatangan: p.namaPenandatangan, jabatanPenandatangan: p.jabatanPenandatangan,
            namaPenanggungJawab: p.namaPenanggungJawab, jabatanPenanggungJawab: p.jabatanPenanggungJawab,
            emailPenanggungJawab: p.emailPenanggungJawab, open: true,
          })));
        }

        if (data.bentukKegiatan) {
          setOriginalBentuk(data.bentukKegiatan);
          setBentukKegiatanList(data.bentukKegiatan.map((b: any) => ({
            id: b.id, bentuk: b.bentuk, penerimaan: b.penerimaan?.toString() || "",
            volume: b.volume, satuan: b.satuan, sasaran: b.sasaran, indikator: b.indikator, keterangan: b.keterangan, open: true,
          })));
        }

        if (data.dokumen) {
          setExistingDokumen(data.dokumen);
          const utama = data.dokumen.find((d: any) => d.jenis === "utama");
          if (utama?.linkUrl) setLinkDokumen(utama.linkUrl);
        }
      } catch (err) {
        console.error(err);
        alert("Gagal mengambil detail repository");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

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
      setSuccessModal({ title: "Penggiat Berhasil Diperbarui", message: "Data penggiat kerjasama telah berhasil diperbarui." });
    } else {
      setPenggiatList((prev) => [...prev, { ...penggiat, id: Date.now() }]);
      setSuccessModal({ title: "Penggiat Berhasil Ditambahkan", message: "Data penggiat kerjasama telah berhasil ditambahkan." });
    }
    setPenggiat({ pihakKe: "", penggiatId: "", namaPenandatangan: "", jabatanPenandatangan: "", namaPenanggungJawab: "", jabatanPenanggungJawab: "", emailPenanggungJawab: "" });
    setEditingPenggiat(null);
    setOpenPenggiat(false);
  };

  const handleSaveBentukModal = () => {
    if (editingBentuk) {
      setBentukKegiatanList((prev) => prev.map((b) => b.id === editingBentuk.id ? { ...bentukKegiatan, id: b.id } : b));
      setSuccessModal({ title: "Bentuk Kegiatan Berhasil Diperbarui", message: "Data bentuk kegiatan telah berhasil diperbarui." });
    } else {
      setBentukKegiatanList((prev) => [...prev, { ...bentukKegiatan, id: Date.now() }]);
      setSuccessModal({ title: "Bentuk Kegiatan Berhasil Ditambahkan", message: "Data bentuk kegiatan telah berhasil ditambahkan." });
    }
    resetFormBentuk();
    setOpenBentukKegiatan(false);
  };

  const confirmDeletePenggiat = (p: any) => setDeleteTarget({ type: "penggiat", item: p });
  const confirmDeleteBentuk = (b: any) => setDeleteTarget({ type: "bentuk", item: b });

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === "penggiat") {
      setPenggiatList((prev) => prev.filter((p) => p.id !== deleteTarget.item.id));
      setSuccessModal({ title: "Penggiat Berhasil Dihapus", message: "Data penggiat telah berhasil dihapus." });
    } else {
      setBentukKegiatanList((prev) => prev.filter((b) => b.id !== deleteTarget.item.id));
      setSuccessModal({ title: "Bentuk Kegiatan Berhasil Dihapus", message: "Data bentuk kegiatan telah berhasil dihapus." });
    }
    setDeleteTarget(null);
  };

  const handleDeleteDokumen = async (dokumenId: number) => {
    if (!confirm("Yakin ingin menghapus file ini?")) return;
    await fetch(API.repositoryDetail(id), { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ deleteDokumenId: dokumenId }) });
    setExistingDokumen((prev) => prev.filter((d) => d.id !== dokumenId));
  };

  /* ===== VALIDATION ===== */
  const isLinkValid = !linkDokumen || /^https?:\/\/.+/i.test(linkDokumen);
  const canSave = agree && isLinkValid;

  /* ===== SUBMIT ===== */
  const handleUpdate = async () => {
    if (canSave === false) return;
    try {
      const res = await fetch(API.repositoryDetail(id), {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statusDokumen, jenisDokumen, dasarDokumen, skalaKerjasama, tanggalMulai, tanggalBerakhir, nomorDokumen, judulKerjasama, deskripsi, sumberPendanaan, unitPenanggungJawab, anggaran }),
      });
      if (!res.ok) throw new Error("Gagal update repository");

      const existingIds = originalPenggiat.map((p: any) => p.id);
      await Promise.all([
        ...penggiatList.map((p) => existingIds.includes(p.id)
          ? fetch(API.repositoryDetailPenggiat(p.id.toString()), { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(p) })
          : fetch(API.repositoryPenggiat, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ repositoryId: id, ...p }) })),
        ...originalPenggiat.filter((old) => !penggiatList.find((p) => p.id === old.id)).map((old) => fetch(API.repositoryDetailPenggiat(old.id.toString()), { method: "DELETE" })),
      ]);

      const existingBentukIds = originalBentuk.map((b: any) => b.id);
      await Promise.all([
        ...bentukKegiatanList.map((b) => existingBentukIds.includes(b.id)
          ? fetch(API.bentukKegiatanDetail(b.id.toString()), { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b) })
          : fetch(API.repositoryBentukKegiatan, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ repositoryId: id, ...b }) })),
        ...originalBentuk.filter((old) => !bentukKegiatanList.find((b) => b.id === old.id)).map((old) => fetch(API.bentukKegiatanDetail(old.id.toString()), { method: "DELETE" })),
      ]);

      const existingTerminRes = await fetch(API.repositoryDetailTermin(id));
      const existingTermin = await existingTerminRes.json();
      const terminList = [{ terminKe: 1, ...termin1 }, { terminKe: 2, ...termin2 }, { terminKe: 3, ...termin3 }].filter((t) => t.bulan && t.tahun && t.jumlah);
      await Promise.all(terminList.map((t) => {
        const existing = existingTermin.find((x: any) => x.terminKe === t.terminKe);
        return existing
          ? fetch(API.repositoryDetailTermin(existing.id.toString()), { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(t) })
          : fetch(API.repositoryTermin, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ repositoryId: id, ...t }) });
      }));

      await Promise.all([
        fileDokumen && (async () => { const fd = new FormData(); fd.append("file", fileDokumen); fd.append("repositoryId", id); fd.append("jenis", "utama"); await fetch(API.repositoryUpload, { method: "POST", body: fd }); })(),
        fileKontrak && (async () => { const fd = new FormData(); fd.append("file", fileKontrak); fd.append("repositoryId", id); fd.append("jenis", "kontrak"); await fetch(API.repositoryUpload, { method: "POST", body: fd }); })(),
        fileKAK && (async () => { const fd = new FormData(); fd.append("file", fileKAK); fd.append("repositoryId", id); fd.append("jenis", "kak"); await fetch(API.repositoryUpload, { method: "POST", body: fd }); })(),
        fileRAB && (async () => { const fd = new FormData(); fd.append("file", fileRAB); fd.append("repositoryId", id); fd.append("jenis", "rab"); await fetch(API.repositoryUpload, { method: "POST", body: fd }); })(),
      ]);

      setShowUpdateSuccess(true);
      setTimeout(() => router.push("/kerjasama/my-data"), 2000);
    } catch (err) {
      console.error(err);
      setErrorMessage("Terjadi kesalahan saat memperbarui repository.");
      setShowUpdateError(true);
    }
  };

  /* ===== LOADING ===== */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Memuat data repository...</p>
        </div>
      </div>
    );
  }

  /* ===== RENDER ===== */
  return (
    <div className="min-h-screen bg-background">
      <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} onExpandChange={setSidebarExpanded} />
      <div className={cn("relative transition-all duration-300", sidebarExpanded ? "md:ml-64" : "md:ml-[72px]")}>
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-xl md:text-2xl font-bold">Edit Repository</h1>
              <Button variant="destructive" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <SectionMasaBerlaku statusDokumen={statusDokumen} setStatusDokumen={setStatusDokumen as any} tanggalMulai={tanggalMulai} setTanggalMulai={setTanggalMulai as any} tanggalBerakhir={tanggalBerakhir} setTanggalBerakhir={setTanggalBerakhir as any} statusOptions={STATUS_DOKUMEN_OPTIONS} />
                <SectionDokumenKerjasama jenisDokumen={jenisDokumen} setJenisDokumen={setJenisDokumen as any} nomorDokumen={nomorDokumen} setNomorDokumen={setNomorDokumen as any} judulKerjasama={judulKerjasama} setJudulKerjasama={setJudulKerjasama as any} deskripsi={deskripsi} setDeskripsi={wrapDeskripsi} skalaKerjasama={skalaKerjasama} setSkalaKerjasama={setSkalaKerjasama as any} dasarDokumen={dasarDokumen} setDasarDokumen={setDasarDokumen as any} mouList={mouList} jenisOptions={JENIS_DOKUMEN_OPTIONS} skalaOptions={SKALA_KERJASAMA_OPTIONS} />
                <SectionFileDokumen fileDokumen={fileDokumen} setFileDokumen={setFileDokumen} fileKontrak={fileKontrak} setFileKontrak={setFileKontrak} fileKAK={fileKAK} setFileKAK={setFileKAK} fileRAB={fileRAB} setFileRAB={setFileRAB} linkDokumen={linkDokumen} setLinkDokumen={setLinkDokumen as any} existingDokumen={existingDokumen} setPreviewUrl={setPreviewUrl} setPreviewFile={setPreviewFile} FileInputComponent={FileInput} isLinkValid={isLinkValid} isEditMode onFileError={setFileError} />
              </div>
              <div className="space-y-6">
                <SectionUnitPelaksana unitNama={unitNama} />
                <SectionAnggaran sumberPendanaan={sumberPendanaan} setSumberPendanaan={setSumberPendanaan as any} anggaran={anggaran} setAnggaran={setAnggaran as any} namaPenanggungJawab={namaPenanggungJawab} setNamaPenanggungJawab={setNamaPenanggungJawab as any} unitPenanggungJawab={unitPenanggungJawab} setUnitPenanggungJawab={setUnitPenanggungJawab as any} termin1={termin1} setTermin1={setTermin1} termin2={termin2} setTermin2={setTermin2} termin3={termin3} setTermin3={setTermin3} sumberOptions={SUMBER_PENDANAAN_OPTIONS} unitOptions={UNIT_PENANGGUNG_JAWAB_OPTIONS} />
                <SectionPenggiatKerjasama penggiatList={penggiatList} setPenggiatList={setPenggiatList} editingPenggiat={editingPenggiat} setEditingPenggiat={setEditingPenggiat} openPenggiat={openPenggiat} setOpenPenggiat={setOpenPenggiat} openDataPenggiat={openDataPenggiat} setOpenDataPenggiat={setOpenDataPenggiat} onAddPenggiat={() => setPenggiat({ pihakKe: "", penggiatId: "", namaPenandatangan: "", jabatanPenandatangan: "", namaPenanggungJawab: "", jabatanPenanggungJawab: "", emailPenanggungJawab: "" })} getNamaInstansi={getNamaInstansi} setPenggiat={setPenggiat} onDeletePenggiat={confirmDeletePenggiat} />
                <SectionBentukKegiatan bentukKegiatanList={bentukKegiatanList} setBentukKegiatanList={setBentukKegiatanList} editingBentuk={editingBentuk} setEditingBentuk={setEditingBentuk} openBentukKegiatan={openBentukKegiatan} setOpenBentukKegiatan={setOpenBentukKegiatan} bentuk={bentukKegiatan} setBentuk={setBentuk} onDeleteBentuk={confirmDeleteBentuk} />
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
                <Button className="px-10" disabled={!canSave} onClick={handleUpdate}>
                  <Save className="w-4 h-4 mr-2" /> Update
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* PREVIEW FILE */}
      {(previewFile || previewUrl) && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl h-[80vh] flex flex-col shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="text-sm font-semibold">Preview Dokumen</h3>
              <button onClick={() => { setPreviewFile(null); setPreviewUrl(null); }}><X className="w-5 h-5" /></button>
            </div>
            <iframe src={previewFile ? URL.createObjectURL(previewFile) : previewUrl || ""} className="w-full flex-1" />
          </div>
        </div>
      )}

      {/* SUCCESS */}

      <ModalPenggiat open={openPenggiat} onClose={() => { setOpenPenggiat(false); setEditingPenggiat(null); }} editing={editingPenggiat} onSave={handleSavePenggiatModal} penggiat={penggiat} setPenggiat={setPenggiat} penggiatOptions={penggiatOptions} />
      <ModalDataPenggiat open={openDataPenggiat} onClose={() => setOpenDataPenggiat(false)} dataPenggiat={dataPenggiat} setDataPenggiat={setDataPenggiat} klasifikasiOptions={KLASIFIKASI_MITRA_OPTIONS} bidangOptions={BIDANG_USAHA_OPTIONS} negaraOptions={NEGARA_OPTIONS} onSave={handleSaveDataPenggiat} />
      <ModalBentukKegiatan open={openBentukKegiatan} onClose={() => { setOpenBentukKegiatan(false); resetFormBentuk(); }} editing={editingBentuk} bentuk={bentukKegiatan} setBentuk={setBentuk} onSave={handleSaveBentukModal} bentukOptions={BENTUK_KEGIATAN_OPTIONS} sasaranOptions={SASARAN_OPTIONS} indikatorOptions={INDIKATOR_OPTIONS} />

      {showUpdateSuccess && (
        <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 text-center space-y-4 w-full max-w-sm">
            <div className="text-green-600 text-4xl">✔</div>
            <h3 className="text-base font-semibold">Repository Berhasil Diperbarui</h3>
            <p className="text-sm text-muted-foreground">Data repository kerjasama telah berhasil diperbarui.</p>
            <Button onClick={() => router.push("/kerjasama/my-data")} className="w-full">OK</Button>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL (penggiat / bentuk kegiatan) */}
      {successModal && (
        <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 text-center space-y-4 w-full max-w-sm">
            <div className="text-green-600 text-4xl">✔</div>
            <h3 className="text-base font-semibold">{successModal.title}</h3>
            <p className="text-sm text-muted-foreground">{successModal.message}</p>
            <Button onClick={() => setSuccessModal(null)} className="w-full">OK</Button>
          </div>
        </div>
      )}

      {/* KONFIRMASI HAPUS */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 text-center space-y-4 w-full max-w-sm">
            <div className="text-red-500 text-4xl">⚠</div>
            <h3 className="text-base font-semibold">
              Hapus {deleteTarget.type === "penggiat" ? "Penggiat?" : "Bentuk Kegiatan?"}
            </h3>
            <p className="text-sm text-muted-foreground">
              Data {deleteTarget.type === "penggiat"
                ? `penggiat pihak ke-${deleteTarget.item.pihakKe}`
                : `bentuk kegiatan "${deleteTarget.item.bentuk}"`} akan dihapus. Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>Batal</Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>Ya, Hapus</Button>
            </div>
          </div>
        </div>
      )}

      {/* ERROR */}
      {showUpdateError && (
        <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 text-center space-y-4 w-full max-w-sm">
            <div className="text-red-600 text-4xl">✘</div>
            <h3 className="text-base font-semibold">Terjadi Kesalahan</h3>
            <p className="text-sm text-muted-foreground">{errorMessage}</p>
            <Button onClick={() => setShowUpdateError(false)} className="w-full">Tutup</Button>
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