import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const base = (process.env.ROCKETRIDE_BASE_URL ?? "http://127.0.0.1:5565").replace(
    /\/$/,
    "",
  );

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);

  try {
    const res = await fetch(`${base}/health`, {
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timeout);
    const text = await res.text();

    return NextResponse.json({
      ok: res.ok,
      status: res.status,
      baseUrl: base,
      bodyPreview: text.slice(0, 240),
    });
  } catch (e) {
    clearTimeout(timeout);
    return NextResponse.json({
      ok: false,
      status: 0,
      baseUrl: base,
      error: e instanceof Error ? e.message : "unknown",
    });
  }
}
