import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { dasarDokumen: { contains: search, mode: "insensitive" as const } },
            { danaMitra: { contains: search, mode: "insensitive" as const } },
            { catatan: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      prisma.pencairanDana.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.pencairanDana.count({ where }),
    ]);

    const safeData = data.map((item) => ({
      ...item,
      id: item.id.toString(),
      jumlah: item.jumlah?.toString(),
    }));

    return NextResponse.json({
      data: safeData,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GET /api/pencairan error:", error);
    return NextResponse.json({ data: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0 } }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const pencairan = await prisma.pencairanDana.create({
      data: {
        dasarDokumen: body.dasarDokumen,
        danaMitra: body.danaMitra,
        jumlah: body.jumlah,
        tanggal: body.tanggal ? new Date(body.tanggal) : null,
        catatan: body.catatan,
        status: "Diajukan",
      },
    });

    return NextResponse.json({ ...pencairan, id: pencairan.id.toString() });
  } catch (error) {
    console.error("POST /api/pencairan error:", error);
    return NextResponse.json({ message: "Gagal menyimpan pencairan dana" }, { status: 500 });
  }
}
