import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.repositoryId) {
      return NextResponse.json(
        { message: "Repository ID wajib diisi" },
        { status: 400 }
      );
    }

    const data = await prisma.repositoryBentukKegiatan.create({
      data: {
        repositoryId: BigInt(body.repositoryId),
        bentuk: body.bentuk,
        penerimaan: body.penerimaan ? Number(body.penerimaan) : null,
        volume: body.volume || null,
        satuan: body.satuan || null,
        sasaran: body.sasaran,
        indikator: body.indikator || null,
        keterangan: body.keterangan || null,
      },
    });

    return NextResponse.json(
      { ...data, id: data.id.toString() },
      { status: 201 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Gagal menyimpan bentuk kegiatan" },
      { status: 500 }
    );
  }
}
