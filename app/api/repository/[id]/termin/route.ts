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

    const termin = await prisma.repositoryTermin.findMany({
      where: { repositoryId: BigInt(id) },
    });

    const safeData = JSON.parse(
      JSON.stringify(termin, (_k, v) =>
        typeof v === "bigint" ? v.toString() : v
      )
    );

    return NextResponse.json(safeData);
  } catch (err) {
    console.error("GET TERMIN ERROR:", err);
    return NextResponse.json(
      { message: "Gagal mengambil termin" },
      { status: 500 }
    );
  }
}
