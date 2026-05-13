import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET Realisasi
 */
export async function GET() {
  try {
    const data = await prisma.realisasi.findMany({
      include: {
        repository: {
          include: {
            mitra: true,
          },
        },
        dokumen: true,
      },
      orderBy: {
        createdAt: "desc",
      },
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

    return NextResponse.json(
      { error: "Gagal ambil data" },
      { status: 500 }
    );
  }
}

/**
 * POST Realisasi
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const realisasi = await prisma.realisasi.create({
      data: {
        repositoryId: BigInt(body.repositoryId),

        bentukKegiatan: body.bentuk,
        judulKegiatan: body.judul,

        tanggalKegiatan: new Date(body.tanggal),

        jumlahDosen: Number(body.dosen),
        jumlahMahasiswa: Number(body.mahasiswa),

        hasilKegiatan: body.hasil,

        anggaran: body.anggaran
          ? Number(body.anggaran)
          : null,
      },
    });

    return NextResponse.json(
  JSON.parse(
    JSON.stringify(realisasi, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  )
);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Gagal simpan realisasi" },
      { status: 500 },
    );
  }
}

