import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();

    cookieStore.set("user_id", "", {
      path: "/",
      maxAge: 0, // ⬅️ ini yang menghapus cookie
    });

    return NextResponse.json({
      success: true,
      message: "Logout berhasil",
    });
  } catch (error) {
    console.error("LOGOUT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Logout gagal" },
      { status: 500 }
    );
  }
}
