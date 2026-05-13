import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const mitra = await prisma.repositoryMitra.upsert({
      where: { repositoryId: BigInt(body.repositoryId) },
      update: {
        klasifikasiMitra: body.klasifikasiMitra,
        namaMitra: body.namaMitra,
        bidangUsaha: body.bidangUsaha,
        negara: body.negara,
        provinsi: body.provinsi,
        alamat: body.alamat,
        npwp: body.npwp,
        noTelp: body.noTelp,
        noFax: body.noFax,
        email: body.email,
        website: body.website,
      },
      create: {
        repositoryId: BigInt(body.repositoryId),
        klasifikasiMitra: body.klasifikasiMitra,
        namaMitra: body.namaMitra,
        bidangUsaha: body.bidangUsaha,
        negara: body.negara,
        provinsi: body.provinsi,
        alamat: body.alamat,
        npwp: body.npwp,
        noTelp: body.noTelp,
        noFax: body.noFax,
        email: body.email,
        website: body.website,
      },
    });

    return NextResponse.json(mitra, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Gagal menyimpan mitra" },
      { status: 500 }
    );
  }
}
