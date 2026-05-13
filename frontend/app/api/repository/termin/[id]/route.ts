import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id || !/^\d+$/.test(id)) {
      return NextResponse.json(
        { message: "ID tidak valid" },
        { status: 400 }
      );
    }

    const data = await prisma.repositoryTermin.findMany({
      where: {
        repositoryId: BigInt(id),
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET TERMIN ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}