import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id || !/^\d+$/.test(id)) {
      return NextResponse.json(
        { message: "ID tidak valid" },
        { status: 400 }
      );
    }

    const data = await prisma.repository.findUnique({
      where: { id: BigInt(id) },
      include: {
        dokumen: true,
        penggiat: true,
        mitra: true,
        bentukKegiatan: true,
        termin: true,
      },
    });

    if (!data) {
      return NextResponse.json(
        { message: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    const safeData = JSON.parse(
      JSON.stringify(data, (_k, v) =>
        typeof v === "bigint" ? v.toString() : v
      )
    );

    return NextResponse.json(safeData);
  } catch (err) {
    console.error("GET DETAIL ERROR:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    if (!id || !/^\d+$/.test(id)) {
      return NextResponse.json(
        { message: "ID tidak valid" },
        { status: 400 }
      );
    }

    await prisma.repository.update({
      where: { id: BigInt(id) },
      data: {
        statusDokumen: body.statusDokumen,
        jenisDokumen: body.jenisDokumen,
        dasarDokumen: body.dasarDokumen?.trim() || null,
        skalaKerjasama: body.skalaKerjasama,
        tanggalMulai: body.tanggalMulai ? new Date(body.tanggalMulai) : undefined,
        tanggalBerakhir: body.tanggalBerakhir ? new Date(body.tanggalBerakhir) : undefined,
        nomorDokumen: body.nomorDokumen,
        judulKerjasama: body.judulKerjasama,
        deskripsi: body.deskripsi,
        sumberPendanaan: body.sumberPendanaan,
        unitPenanggungJawab: body.unitPenanggungJawab,
        jumlahAnggaran: body.anggaran
          ? Number(body.anggaran)
          : null,
      },
    });

    return NextResponse.json({ message: "Berhasil update" });
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    return NextResponse.json(
      { message: "Gagal update repository" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id || !/^\d+$/.test(id)) {
      return NextResponse.json(
        { message: "ID tidak valid" },
        { status: 400 }
      );
    }

    const repositoryId = BigInt(id);

    const repo = await prisma.repository.findUnique({
      where: { id: repositoryId },
    });

    if (!repo) {
      return NextResponse.json(
        { message: "Repository tidak ditemukan" },
        { status: 404 }
      );
    }

    const files = await prisma.repositoryDokumen.findMany({
      where: { repositoryId },
    });

    for (const f of files) {
      if (!f.filePath) continue;
      const filePath = path.join(process.cwd(), "public", f.filePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await prisma.repositoryDokumen.deleteMany({ where: { repositoryId } });
    await prisma.repositoryPenggiat.deleteMany({ where: { repositoryId } });
    await prisma.repositoryBentukKegiatan.deleteMany({ where: { repositoryId } });
    await prisma.repositoryTermin.deleteMany({ where: { repositoryId } });
    await prisma.repositoryMitra.deleteMany({ where: { repositoryId } });

    await prisma.repository.delete({ where: { id: repositoryId } });

    return NextResponse.json({ message: "Repository berhasil dihapus" });
  } catch (e) {
    console.error("DELETE ERROR:", e);
    return NextResponse.json(
      { message: "Gagal menghapus repository" },
      { status: 500 }
    );
  }
}
