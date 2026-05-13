import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: BigInt(userId) },
      include: {
        unit: true,
        subUnit: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    /* ==============================
       ROLE: UNIT KERJA
       ============================== */
    if (user.role === "UNIT_KERJA" && user.unitId) {
      const subUnits = await prisma.subUnit.findMany({
        where: { unitKerjaId: user.unitId },
        include: {
          repositories: true, // ✅ BENAR
        },
      });

      const result = subUnits.map((sub) => {
        const mou = sub.repositories.filter(r => r.jenisDokumen === "MOU").length;
        const moa = sub.repositories.filter(r => r.jenisDokumen === "MOA").length;
        const ia  = sub.repositories.filter(r => r.jenisDokumen === "IA").length;

        return {
          id: sub.id.toString(),
          kodeUnit: sub.kode,
          namaUnit: sub.nama,
          dokumen: { mou, moa, ia },
        };
      });

      return NextResponse.json(result);
    }

    /* ==============================
       ROLE: SUB UNIT
       ============================== */
    if (user.role === "SUB_UNIT" && user.subUnitId) {
      const sub = await prisma.subUnit.findUnique({
        where: { id: user.subUnitId },
        include: {
          repositories: true, // ✅ BENAR
        },
      });

      if (!sub) return NextResponse.json([]);

      const mou = sub.repositories.filter(r => r.jenisDokumen === "MOU").length;
      const moa = sub.repositories.filter(r => r.jenisDokumen === "MOA").length;
      const ia  = sub.repositories.filter(r => r.jenisDokumen === "IA").length;

      return NextResponse.json([
        {
          id: sub.id.toString(),
          kodeUnit: sub.kode,
          namaUnit: sub.nama,
          dokumen: { mou, moa, ia },
        },
      ]);
    }

    return NextResponse.json([]);

  } catch (error) {
    console.error("SUBUNIT API ERROR:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}