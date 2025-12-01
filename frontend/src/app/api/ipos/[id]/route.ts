import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: Request, context: { params: any }) {
  try {
    // Fix: Ensure params is resolved
    const paramsCandidate = context?.params;

    const resolvedParams =
      paramsCandidate && typeof paramsCandidate.then === 'function'
        ? await paramsCandidate
        : paramsCandidate;

    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing ID" },
        { status: 400 }
      );
    }

    // Call your backend
    const backendURL = `http://localhost:5000/api/ipos/${id}`;

    const res = await axios.get(backendURL);

    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error("Error in /api/ipos/[id]", err.message);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
