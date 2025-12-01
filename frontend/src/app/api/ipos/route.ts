import { NextResponse } from "next/server";
import { api } from "@/lib/axiosClient";

export async function GET() {
  try {
    const res = await api.get("/api/ipos");
    return NextResponse.json(res.data);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to load IPOs" },
      { status: err.response?.status || 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const res = await api.post("/api/ipos", body);
    return NextResponse.json(res.data);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create IPO" },
      { status: err.response?.status || 500 }
    );
  }
}