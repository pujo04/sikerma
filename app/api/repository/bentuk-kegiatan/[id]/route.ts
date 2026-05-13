import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    if (!id || !/^\d+$/.test(id)) {
      return NextResponse.json(
        { message: "ID tidak valid" },
        { status: 400 }
      );
    }

    const updated = await prisma.repositoryBentukKegiatan.update({
      where: { id: BigInt(id) },
      data: {
        bentuk: body.bentuk,
        penerimaan: body.penerimaan ? Number(body.penerimaan) : null,
        volume: body.volume || null,
        satuan: body.satuan || null,
        sasaran: body.sasaran,
        indikator: body.indikator || null,
        keterangan: body.keterangan || null,
      },
    });

    return NextResponse.json({
      ...updated,
      id: updated.id.toString(),
      repositoryId: updated.repositoryId.toString(),
      penerimaan: updated.penerimaan?.toString() ?? null,
    });
  } catch (err) {
    console.error("UPDATE BENTUK ERROR:", err);
    return NextResponse.json(
      { message: "Gagal update bentuk kegiatan" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    await prisma.repositoryBentukKegiatan.delete({
      where: { id: BigInt(id) },
    });

    return NextResponse.json({
      message: "Bentuk kegiatan berhasil dihapus",
    });
  } catch (err) {
    console.error("DELETE BENTUK ERROR:", err);
    return NextResponse.json(
      { message: "Gagal menghapus bentuk kegiatan" },
      { status: 500 }
    );
  }
}
