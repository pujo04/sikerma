import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || !/^\d+$/.test(id)) {
      return NextResponse.json(
        { message: "ID tidak valid" },
        { status: 400 }
      );
    }

    const data = await prisma.repositoryPenggiat.findMany({
      where: {
        repositoryId: BigInt(id),
      },
      include: {
        penggiat: true, // kalau ada relasi tabel penggiat
      },
      orderBy: {
        id: "asc",
      },
    });

    const safeData = data.map((d) => ({
      ...d,
      id: d.id.toString(),
      repositoryId: d.repositoryId.toString(),
      penggiatId: d.penggiatId?.toString() ?? null,
    }));

    return NextResponse.json(safeData);
  } catch (err) {
    console.error("GET PENGGIAT ERROR:", err);
    return NextResponse.json(
      { message: "Gagal mengambil penggiat" },
      { status: 500 }
    );
  }
}