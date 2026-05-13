import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const data = await prisma.repository.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        statusDokumen: true,
        tanggalMulai: true,
        tanggalBerakhir: true,
        jenisDokumen: true,
        dasarDokumen: true,
        nomorDokumen: true,
        judulKerjasama: true,
        deskripsi: true,
        skalaKerjasama: true,
        sumberPendanaan: true,
        jumlahAnggaran: true,
        unitPenanggungJawab: true,
        namaPenanggungJawab: true,
        createdByUnitId: true,
        createdBySubUnitId: true,
        dokumen: true,
        penggiat: {
          select: {
            id: true,
            instansi: true,
            namaPenandatangan: true,
            jabatanPenandatangan: true,
            emailPenandatangan: true,
            nipPenandatangan: true,
            namaPenanggungJawab: true,
            jabatanPenanggungJawab: true,
            emailPenanggungJawab: true,
            penggiat: {
              select: {
                id: true,
                namaInstansi: true,
              },
            },
          },
        },
        mitra: {
          select: {
            id: true,
            namaMitra: true,
            alamat: true,
            email: true,
            noTelp: true,
          },
        },
        bentukKegiatan: {
          select: {
            id: true,
            bentuk: true,
          },
        },
        termin: {
          select: {
            id: true,
            terminKe: true,
            bulan: true,
            tahun: true,
            jumlah: true,
          },
        },
      },
    });

    const safeData = JSON.parse(
      JSON.stringify(data, (_key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    return NextResponse.json({ data: safeData });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Gagal mengambil repository" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: BigInt(userId) },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    const repository = await prisma.repository.create({
      data: {
        statusDokumen: body.statusDokumen?.trim() || "Aktif",
        tanggalMulai: body.tanggalMulai ? new Date(body.tanggalMulai) : new Date(),
        tanggalBerakhir: body.tanggalBerakhir ? new Date(body.tanggalBerakhir) : new Date(),
        jenisDokumen: body.jenisDokumen?.trim() || "MOU",
        dasarDokumen: body.dasarDokumen?.trim() || null,
        nomorDokumen: body.nomorDokumen?.trim() || "",
        judulKerjasama: body.judulKerjasama?.trim() || "",
        deskripsi: body.deskripsi?.trim() || null,
        skalaKerjasama: body.skalaKerjasama?.trim() || "LOKAL",
        sumberPendanaan: body.sumberPendanaan?.trim() || "",
        jumlahAnggaran: body.jumlahAnggaran !== null && body.jumlahAnggaran !== undefined && body.jumlahAnggaran !== ""
          ? Number(body.jumlahAnggaran)
          : null,
        unitPenanggungJawab: body.unitPenanggungJawab?.trim() || "",
        namaPenanggungJawab: body.namaPenanggungJawab?.trim() || "",
        createdByUnitId: user.role === "UNIT_KERJA" ? user.unitId : null,
        createdBySubUnitId: user.role === "SUB_UNIT" ? user.subUnitId : null,
      },
    });

    return NextResponse.json(
      { id: repository.id.toString() },
      { status: 201 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Gagal membuat repository" },
      { status: 500 }
    );
  }
}
