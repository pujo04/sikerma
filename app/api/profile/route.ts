import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ success: false, message: "File tidak ditemukan" }, { status: 400 });
    }

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      return NextResponse.json({ success: false, message: "Format file tidak valid" }, { status: 400 });
    }

    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ success: false, message: "Ukuran maksimal 2MB" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: BigInt(userId) },
      select: { image: true },
    });

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.type === "image/png" ? "png" : "jpg";
    const fileName = `${randomUUID()}.${ext}`;

    const uploadDir = path.join(process.cwd(), "public/uploads/profile");
    fs.mkdirSync(uploadDir, { recursive: true });
    const newPath = path.join(uploadDir, fileName);
    fs.writeFileSync(newPath, buffer);
    const imageUrl = `/uploads/profile/${fileName}`;

    if (user?.image) {
      const oldPath = path.join(process.cwd(), "public", user.image);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    await prisma.user.update({
      where: { id: BigInt(userId) },
      data: { image: imageUrl },
    });

    return NextResponse.json({ success: true, imageUrl });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return NextResponse.json({ success: false, message: "Upload foto gagal" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { nama, phone, facebook, twitter, instagram, youtube } = body;

    await prisma.user.update({
      where: { id: BigInt(userId) },
      data: { nama, phone, facebook, twitter, instagram, youtube },
    });

    return NextResponse.json({ success: true, message: "Profile berhasil diperbarui" });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    return NextResponse.json({ success: false, message: "Gagal memperbarui profile" }, { status: 500 });
  }
}
