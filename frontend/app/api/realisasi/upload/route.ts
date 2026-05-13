import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {

  try {

    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    const realisasiId = formData.get("realisasiId");

    if (!file || !realisasiId) {
      return NextResponse.json(
        { message: "Payload tidak lengkap" },
        { status: 400 }
      );
    }

    const id = BigInt(realisasiId.toString());

    /*
    =============================
    VALIDASI FILE
    =============================
    */

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { message: "File harus PDF" },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: "Ukuran maksimal 5MB" },
        { status: 400 }
      );
    }

    /*
    =============================
    CEK REALISASI ADA
    =============================
    */

    const realisasi = await prisma.realisasi.findUnique({
      where: { id }
    });

    if (!realisasi) {
      return NextResponse.json(
        { message: "Realisasi tidak ditemukan" },
        { status: 404 }
      );
    }

    /*
    =============================
    HAPUS FILE LAMA
    =============================
    */

    const oldFiles = await prisma.realisasiDokumen.findMany({
      where: { realisasiId: id }
    });

    for (const f of oldFiles) {

      const oldPath = path.join(
        process.cwd(),
        "public",
        f.filePath
      );

      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }

    }

    await prisma.realisasiDokumen.deleteMany({
      where: { realisasiId: id }
    });

    /*
    =============================
    SIMPAN FILE BARU
    =============================
    */

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "realisasi"
    );

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filename =
      Date.now() + "-" + file.name.replace(/\s+/g, "_");

    const filepath = path.join(uploadDir, filename);

    fs.writeFileSync(filepath, buffer);

    /*
    =============================
    SIMPAN DATABASE
    =============================
    */

    const saved = await prisma.realisasiDokumen.create({
      data: {
        realisasiId: id,
        fileName: file.name,
        filePath: `/uploads/realisasi/${filename}`,
        fileSize: file.size
      }
    });

    return NextResponse.json({
      message: "Upload berhasil",
      filePath: saved.filePath
    });

  } catch (error) {

    console.error("UPLOAD ERROR:", error);

    return NextResponse.json(
      { message: "Upload gagal" },
      { status: 500 }
    );

  }
}