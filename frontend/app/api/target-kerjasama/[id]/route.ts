import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET Target Kerjasama by ID
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await prisma.targetKerjasama.findUnique({
      where: { id: BigInt(id) },
    });

    if (!data) {
      return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });
    }

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
 * PUT Target Kerjasama
 */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const target = await prisma.targetKerjasama.update({
      where: { id: BigInt(id) },
      data: {
        tahun: Number(body.tahun ?? 0),
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
    return NextResponse.json({ error: "Gagal update data" }, { status: 500 });
  }
}

/**
 * DELETE Target Kerjasama
 */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.targetKerjasama.delete({
      where: { id: BigInt(id) },
    });

    return NextResponse.json({ message: "Berhasil hapus data" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal hapus data" }, { status: 500 });
  }
}