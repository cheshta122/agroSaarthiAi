import { NextResponse } from "next/server";

const BACKEND_BASE_URL =
  process.env.BACKEND_BASE_URL?.replace(/\/$/, "") || "http://localhost:8000";

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    const backendResponse = await fetch(`${BACKEND_BASE_URL}/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const bodyText = await backendResponse.text();
    const contentType = backendResponse.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? JSON.parse(bodyText)
      : { detail: bodyText };

    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    const detail =
      error instanceof Error
        ? error.message
        : "Unable to connect to the AgroSaarthi backend.";

    return NextResponse.json(
      {
        detail:
          "Could not reach the FastAPI backend. Start it on port 8000, then try again.",
        cause: detail
      },
      { status: 503 }
    );
  }
}
