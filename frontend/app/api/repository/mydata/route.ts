import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json([], { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: BigInt(userId) },
    });

    if (!user) {
      return NextResponse.json([], { status: 404 });
    }

    const whereClause =
      user.role === "UNIT_KERJA"
        ? { createdByUnitId: user.unitId }
        : { createdBySubUnitId: user.subUnitId };

    const data = await prisma.repository.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      include: {
        mitra: true,
        termin: true,
        bentukKegiatan: true,
        penggiat: { include: { penggiat: true } },
        dokumen: true,
      },
    });

    const safeData = JSON.parse(
      JSON.stringify(data, (_k, v) =>
        typeof v === "bigint" ? v.toString() : v
      )
    );

    return NextResponse.json(safeData);
  } catch (err) {
    console.error(err);
    return NextResponse.json([], { status: 500 });
  }
}
