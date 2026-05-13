import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const res = NextResponse.json({ success: true, message: "Logout berhasil" });
  res.cookies.delete("user_id");
  return res;
}
