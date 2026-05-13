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

    const updated = await prisma.repositoryPenggiat.update({
      where: { id: BigInt(id) },
      data: {
        penggiatId: body.penggiatId ? BigInt(body.penggiatId) : null,
        instansi: body.instansi ?? "",
        emailPenandatangan: body.emailPenandatangan,
        nipPenandatangan: body.nipPenandatangan,
        namaPenandatangan: body.namaPenandatangan,
        jabatanPenandatangan: body.jabatanPenandatangan,
        namaPenanggungJawab: body.namaPenanggungJawab,
        jabatanPenanggungJawab: body.jabatanPenanggungJawab,
        emailPenanggungJawab: body.emailPenanggungJawab,
      },
    });

    return NextResponse.json({
      ...updated,
      id: updated.id.toString(),
      repositoryId: updated.repositoryId.toString(),
      penggiatId: updated.penggiatId?.toString() ?? null,
    });
  } catch (err) {
    console.error("UPDATE PENGGIAT ERROR:", err);
    return NextResponse.json(
      { message: "Gagal update penggiat" },
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

    await prisma.repositoryPenggiat.delete({
      where: { id: BigInt(id) },
    });

    return NextResponse.json({
      message: "Penggiat berhasil dihapus",
    });
  } catch (err) {
    console.error("DELETE PENGGIAT ERROR:", err);
    return NextResponse.json(
      { message: "Gagal menghapus penggiat" },
      { status: 500 }
    );
  }
}
