import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/* ================= HELPER ================= */
const serializePenggiat = (p: any) => ({
  ...p,
  id: p.id.toString(),
});

/* ================= GET ================= */
export async function GET() {
  try {
    const data = await prisma.penggiat.findMany({
      orderBy: { namaInstansi: "asc" },
    });

    return NextResponse.json(data.map(serializePenggiat));
  } catch (e) {
    console.error("GET /api/penggiat error:", e);
    return NextResponse.json(
      { message: "Gagal mengambil data penggiat" },
      { status: 500 }
    );
  }
}

/* ================= POST ================= */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.namaInstansi) {
      return NextResponse.json(
        { message: "Nama instansi wajib" },
        { status: 400 }
      );
    }

    const penggiat = await prisma.penggiat.upsert({
      where: { namaInstansi: body.namaInstansi },
      update: {
        klasifikasiMitra: body.klasifikasiMitra,
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
        namaInstansi: body.namaInstansi,
        klasifikasiMitra: body.klasifikasiMitra,
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

    return NextResponse.json(serializePenggiat(penggiat), {
      status: 201,
    });
  } catch (e) {
    console.error("POST /api/penggiat error:", e);
    return NextResponse.json(
      { message: "Gagal menyimpan penggiat" },
      { status: 500 }
    );
  }
}
