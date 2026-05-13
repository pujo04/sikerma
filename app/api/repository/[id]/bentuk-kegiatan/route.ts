import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    const data = await prisma.repositoryBentukKegiatan.findMany({
      where: { repositoryId: BigInt(id) },
      orderBy: { id: "asc" },
    });

    const safeData = data.map((d) => ({
      ...d,
      id: d.id.toString(),
      repositoryId: d.repositoryId.toString(),
      penerimaan: d.penerimaan?.toString() ?? null,
    }));

    return NextResponse.json(safeData);
  } catch (err) {
    console.error("GET BENTUK KEGIATAN ERROR:", err);
    return NextResponse.json(
      { message: "Gagal mengambil bentuk kegiatan" },
      { status: 500 }
    );
  }
}
