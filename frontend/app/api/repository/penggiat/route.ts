import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const penggiatRepo = await prisma.repositoryPenggiat.create({
      data: {
        repositoryId: BigInt(body.repositoryId),
        penggiatId: body.penggiatId ? BigInt(body.penggiatId) : null,

        // legacy fallback
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

    return NextResponse.json(penggiatRepo, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Gagal menyimpan penggiat repository" },
      { status: 500 }
    );
  }
}
