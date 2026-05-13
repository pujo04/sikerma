import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    /* ================= COOKIE ================= */
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json(
        { message: "Belum login" },
        { status: 401 }
      );
    }

    /* ================= QUERY USER ================= */
    const user = await prisma.user.findUnique({
      where: {
        id: BigInt(userId),
        isActive: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    /* ================= AMBIL UNIT & SUBUNIT ================= */
    let unit = null;
    let subUnit = null;

    if (user.unitId) {
      const u = await prisma.unit.findUnique({ where: { id: user.unitId } });
      if (u) {
        unit = { id: u.id.toString(), nama: u.nama, kode: u.kode };
      }
    }

    if (user.subUnitId) {
      const su = await prisma.subUnit.findUnique({ where: { id: user.subUnitId } });
      if (su) {
        subUnit = { id: su.id.toString(), nama: su.nama, kode: su.kode };
      }
    }

    /* ================= RESPONSE ================= */
    return NextResponse.json({
      id: user.id.toString(),
      nama: user.nama,
      email: user.email,
      role: user.role,
      roleLabel: user.role === "UNIT_KERJA" ? "Unit Kerja" : "Sub Unit",
      unit,
      subUnit,
      image: user.image,
    });

  } catch (error) {
    console.error("ME ERROR:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data user" },
      { status: 500 }
    );
  }
}