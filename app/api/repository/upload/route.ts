import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;
    const repositoryId = BigInt(formData.get("repositoryId") as string);
    const jenis = formData.get("jenis") as string;

    if (!file || !repositoryId || !jenis) {
      return NextResponse.json(
        { message: "Payload tidak lengkap" },
        { status: 400 }
      );
    }

    const oldFiles = await prisma.repositoryDokumen.findMany({
      where: { repositoryId, jenis },
    });

    for (const old of oldFiles) {
      if (old.filePath) {
        const oldPath = path.join(process.cwd(), "public", old.filePath);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
    }

    await prisma.repositoryDokumen.deleteMany({
      where: { repositoryId, jenis },
    });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public/uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filename = `${Date.now()}-${file.name}`;
    const filepath = path.join(uploadDir, filename);

    fs.writeFileSync(filepath, buffer);

    const saved = await prisma.repositoryDokumen.create({
      data: {
        repositoryId,
        jenisDokumen: jenis,
        namaFile: file.name,
        filePath: `/uploads/${filename}`,
        fileSize: buffer.length,
      },
    });

    return NextResponse.json(
      {
        message: "Upload berhasil",
        data: {
          id: saved.id.toString(),
          jenis: saved.jenisDokumen,
          filePath: saved.filePath,
        },
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("UPLOAD ERROR:", e);
    return NextResponse.json(
      { message: "Upload gagal di server" },
      { status: 500 }
    );
  }
}
