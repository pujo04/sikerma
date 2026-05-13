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

    const pencairanId = BigInt(id);

    const pencairan = await prisma.pencairanDana.findUnique({
      where: { id: pencairanId },
      include: { dokumen: true },
    });

    if (!pencairan) {
      return NextResponse.json({ message: "Data tidak ditemukan" }, { status: 404 });
    }

    const mapDokumen: any = {};
    pencairan.dokumen.forEach((d: any) => {
      mapDokumen[d.jenisDokumen] = {
        id: d.id.toString(),
        namaFile: d.namaFile,
        filePath: d.filePath,
        fileSize: d.fileSize,
      };
    });

    return NextResponse.json({
      id: pencairan.id.toString(),
      dasarDokumen: pencairan.dasarDokumen,
      danaMitra: pencairan.danaMitra,
      jumlah: pencairan.jumlah?.toString(),
      tanggal: pencairan.tanggal,
      catatan: pencairan.catatan,
      status: pencairan.status,
      dokumen: mapDokumen,
    });
  } catch (error) {
    console.error("GET DETAIL ERROR:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    await prisma.pencairanDana.update({
      where: { id: BigInt(id) },
      data: {
        dasarDokumen: body.dasarDokumen,
        danaMitra: body.danaMitra,
        jumlah: Number(body.jumlah),
        tanggal: new Date(body.tanggal),
        catatan: body.catatan,
      },
    });

    return NextResponse.json({ message: "Updated" });
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    return NextResponse.json({ message: "Gagal update data" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const pencairanId = BigInt(id);

    const dokumen = await prisma.pencairanDanaDokumen.findMany({
      where: { pencairanId },
    });

    for (const d of dokumen) {
      if (d.filePath) {
        const filePath = path.join(process.cwd(), "public", d.filePath);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    await prisma.pencairanDanaDokumen.deleteMany({ where: { pencairanId } });
    await prisma.pencairanDana.delete({ where: { id: pencairanId } });

    return NextResponse.json({ message: "Pencairan berhasil dihapus" });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json({ message: "Gagal menghapus pencairan" }, { status: 500 });
  }
}
