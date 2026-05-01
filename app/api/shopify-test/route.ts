import { NextResponse } from "next/server";
import { getTestProducts } from "@/lib/shopify-test";

export async function GET() {
  try {
    const data = await getTestProducts();
    return NextResponse.json(data);
  } catch (error) {
    console.error("SHOPIFY ERROR:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
} 