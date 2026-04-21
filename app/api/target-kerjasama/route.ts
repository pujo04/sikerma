import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET Target Kerjasama
 */
export async function GET() {
  try {
    const data = await prisma.targetKerjasama.findMany({
      orderBy: { tahun: "desc" },
    });

    return NextResponse.json(
      JSON.parse(
        JSON.stringify(data, (_, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      )
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal ambil data" }, { status: 500 });
  }
}

/**
 * POST Target Kerjasama
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const target = await prisma.targetKerjasama.create({
      data: {
        tahun: Number(body.tahun),
        mou: Number(body.mou ?? 0),
        moa: Number(body.moa ?? 0),
        ia: Number(body.ia ?? 0),
        aktif: Number(body.aktif ?? 0),
        perpanjangan: Number(body.perpanjangan ?? 0),
        kadaluarsa: Number(body.kadaluarsa ?? 0),
        tidakAktif: Number(body.tidakAktif ?? 0),
        status: body.status ?? "Open",
      },
    });

    return NextResponse.json(
      JSON.parse(
        JSON.stringify(target, (_, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      )
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal simpan data" }, { status: 500 });
  }
}