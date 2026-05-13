import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

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
        : user.role === "SUB_UNIT"
        ? { createdBySubUnitId: user.subUnitId }
        : {};

    const data = await prisma.repository.findMany({
      where: { ...whereClause, jenisDokumen: "MOU" },
      select: { id: true, judulKerjasama: true, nomorDokumen: true },
      orderBy: { createdAt: "desc" },
    });

    const safeData = JSON.parse(
      JSON.stringify(data, (_key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    return NextResponse.json(safeData);
  } catch (e) {
    console.error(e);
    return NextResponse.json([], { status: 500 });
  }
}
