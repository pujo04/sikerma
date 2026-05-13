import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

/* ================= GET DETAIL ================= */

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await context.params;

    const pencairanId = BigInt(id);

    const pencairan = await prisma.pencairanDana.findUnique({
      where: { id: pencairanId },
      include: {
        dokumen: true,
      },
    });


    // jika tidak ditemukan
    if (!pencairan) {

      return NextResponse.json(
        { message: "Data tidak ditemukan" },
        { status: 404 }
      );

    }


    // map dokumen supaya mudah dipakai frontend
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
      jumlah: pencairan.jumlah.toString(),
      tanggal: pencairan.tanggal,
      catatan: pencairan.catatan,
      status: pencairan.status,

      dokumen: mapDokumen

    });

  } catch (error) {

    console.error("GET DETAIL ERROR:", error);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );

  }
}



/* ================= UPDATE ================= */

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await context.params;

    const body = await req.json();

    const pencairanId = BigInt(id);


    await prisma.pencairanDana.update({

      where: { id: pencairanId },

      data: {

        dasarDokumen: body.dasarDokumen,
        danaMitra: body.danaMitra,
        jumlah: Number(body.jumlah),
        tanggal: new Date(body.tanggal),
        catatan: body.catatan

      }

    });


    return NextResponse.json({

      message: "Updated"

    });

  } catch (error) {

    console.error("UPDATE ERROR:", error);

    return NextResponse.json(
      { message: "Gagal update data" },
      { status: 500 }
    );

  }

}



/* ================= DELETE ================= */

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await context.params;

    const pencairanId = BigInt(id);


    /* 1️⃣ ambil dokumen */

    const dokumen = await prisma.pencairanDokumen.findMany({
      where: { pencairanId },
    });


    /* 2️⃣ hapus file fisik */

    for (const d of dokumen) {

      const filePath = path.join(
        process.cwd(),
        "public",
        d.filePath
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

    }


    /* 3️⃣ hapus DB dokumen */

    await prisma.pencairanDokumen.deleteMany({
      where: { pencairanId },
    });


    /* 4️⃣ hapus pencairan */

    await prisma.pencairanDana.delete({
      where: { id: pencairanId },
    });


    return NextResponse.json({

      message: "Pencairan berhasil dihapus"

    });


  } catch (error) {

    console.error("DELETE ERROR:", error);

    return NextResponse.json(
      { message: "Gagal menghapus pencairan" },
      { status: 500 }
    );

  }

}