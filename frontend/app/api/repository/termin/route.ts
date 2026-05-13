import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const data = await prisma.repositoryTermin.create({
      data: {
        repositoryId: BigInt(body.repositoryId),
        terminKe: body.terminKe,
        bulan: body.bulan,
        tahun: Number(body.tahun),
        jumlah: Number(body.jumlah),
      },
    });

    return NextResponse.json(
      { ...data, id: data.id.toString() },
      { status: 201 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Gagal menyimpan termin" },
      { status: 500 }
    );
  }
}
