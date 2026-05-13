import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import path from "path";
import fs from "fs";
import fsp from "fs/promises";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;
    const pencairanId = formData.get("pencairanId");
    const jenisDokumen = formData.get("jenisDokumen") as string;

    if (!file || !pencairanId || !jenisDokumen) {
      return NextResponse.json(
        { message: "Data upload tidak lengkap" },
        { status: 400 }
      );
    }

    const idBigInt = BigInt(pencairanId.toString());

    /* ================= HAPUS FILE LAMA ================= */

    const oldDokumen = await prisma.pencairanDokumen.findFirst({
      where: {
        pencairanId: idBigInt,
        jenisDokumen: jenisDokumen,
      },
    });

    if (oldDokumen) {
      const oldPath = path.join(
        process.cwd(),
        "public",
        oldDokumen.filePath
      );

      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }

      await prisma.pencairanDokumen.delete({
        where: { id: oldDokumen.id },
      });
    }

    /* ================= SIMPAN FILE BARU ================= */

    const uploadDir = path.join(
      process.cwd(),
      "public/uploads/pencairan"
    );

    await fsp.mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());

    const fileName = `${Date.now()}-${file.name}`;

    const filePath = path.join(uploadDir, fileName);

    await fsp.writeFile(filePath, buffer);

    /* ================= SIMPAN DB ================= */

    const dokumen = await prisma.pencairanDokumen.create({
      data: {
        pencairanId: idBigInt,
        jenisDokumen,
        fileName,
        filePath: `/uploads/pencairan/${fileName}`,
        fileSize: file.size,
      },
    });

    return NextResponse.json(
      {
        ...dokumen,
        id: dokumen.id.toString(),
        pencairanId: dokumen.pencairanId.toString(),
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return NextResponse.json(
      { message: "Gagal upload file" },
      { status: 500 }
    );
  }
}