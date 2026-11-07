import { NextRequest, NextResponse } from "next/server";

export const config = {
  runtime: "edge",
};

// src/app/api/location/route.ts
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json({ error: "Missing coordinates" }, { status: 400 });
  }

  // The delivery location is optional. Without a key, skip the lookup
  // instead of failing every page load.
  const apiKey = process.env.GEOAPIFY_APIKEY;
  if (!apiKey) {
    return NextResponse.json({ data: null });
  }

  try {
    const res = await fetch(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${encodeURIComponent(
        lat
      )}&lon=${encodeURIComponent(lon)}&apiKey=${apiKey}`
    );
    if (!res.ok) {
      return NextResponse.json({ data: null }, { status: 502 });
    }
    const result = await res.json();
    return NextResponse.json({ data: result?.features?.[0]?.properties ?? null });
  } catch {
    return NextResponse.json({ data: null }, { status: 502 });
  }
}
