import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: BigInt(userId) },
    });

    if (!user) {
      return NextResponse.json({ message: "User tidak ditemukan" }, { status: 404 });
    }

    const whereClause =
      user.role === "UNIT_KERJA"
        ? { id: BigInt(id), createdByUnitId: { not: user.unitId } }
        : user.role === "SUB_UNIT"
        ? { id: BigInt(id), createdBySubUnitId: { not: user.subUnitId } }
        : { id: BigInt(id) };

    const repo = await prisma.repository.findFirst({ where: whereClause });

    if (!repo) {
      return NextResponse.json(
        { message: "Repository tidak ditemukan atau bukan milik unit lain" },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (user.role === "UNIT_KERJA" && user.unitId) {
      if (!repo.originalUnitId && !repo.originalSubUnitId) {
        updateData.originalUnitId = repo.createdByUnitId;
        updateData.originalSubUnitId = repo.createdBySubUnitId;
      }
      updateData.createdByUnitId = user.unitId;
      updateData.createdBySubUnitId = null;
    } else if (user.role === "SUB_UNIT" && user.subUnitId) {
      if (!repo.originalUnitId && !repo.originalSubUnitId) {
        updateData.originalUnitId = repo.createdByUnitId;
        updateData.originalSubUnitId = repo.createdBySubUnitId;
      }
      updateData.createdBySubUnitId = user.subUnitId;
      updateData.createdByUnitId = null;
    }

    await prisma.repository.update({
      where: { id: BigInt(id) },
      data: updateData,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Gagal klaim dokumen" }, { status: 500 });
  }
}
