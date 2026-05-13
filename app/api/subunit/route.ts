import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const data = await prisma.subUnit.findMany({
      include: { unit: true },
      orderBy: { nama: "asc" },
    });

    return NextResponse.json(
      data.map((s) => ({
        id: s.id.toString(),
        kode: s.kode,
        nama: s.nama,
        unit: s.unit ? { id: s.unit.id.toString(), nama: s.unit.nama, kode: s.unit.kode } : null,
      }))
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
