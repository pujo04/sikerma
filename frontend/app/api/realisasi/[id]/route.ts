import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  await prisma.realisasi.update({
    where: { id: BigInt(id) },
    data: {
      bentukKegiatan: body.bentuk,
      judulKegiatan: body.judul,
      tanggalKegiatan: new Date(body.tanggal),
      jumlahDosen: Number(body.dosen),
      jumlahMahasiswa: Number(body.mahasiswa),
      hasilKegiatan: body.hasil,
      anggaran: Number(body.anggaran),
    },
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.realisasi.delete({
      where: { id: BigInt(id) },
    });
    return NextResponse.json({ message: "Berhasil hapus data" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal hapus data" }, { status: 500 });
  }
}
