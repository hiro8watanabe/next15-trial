import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    {
      id: 1,
      name: "山田太郎",
      email: "yamada@example.com",
    },
    {
      id: 2,
      name: "鈴木次郎",
      email: "suzuki@example.com",
    },
  ]);
}
