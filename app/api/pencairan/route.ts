import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET (search + pagination)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10);

  const data = await prisma.pencairanDana.findMany({
    where: {
      OR: [
        { dasarDokumen: { contains: search, mode: "insensitive" } },
        { danaMitra: { contains: search, mode: "insensitive" } },
        { catatan: { contains: search, mode: "insensitive" } },
      ],
    },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { tanggal: "desc" },
  });

  const total = await prisma.pencairanDana.count();

  return NextResponse.json({ data, total });
}

// POST
export async function POST(req: Request) {
  const body = await req.json();

  const result = await prisma.pencairanDana.create({
    data: {
      dasarDokumen: body.dasarDokumen,
      danaMitra: body.danaMitra,
      jumlah: body.jumlah,
      tanggal: new Date(body.tanggal),
      catatan: body.catatan,
      status: "Diajukan",
    },
  });

  return NextResponse.json(result);
}
