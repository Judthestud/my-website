import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { selectedDate, selectedTime, service } = await req.json();

  if (!selectedDate || !selectedTime) {
    return NextResponse.json(
      { error: "Missing selected date or time" },
      { status: 400 }
    );
  }

  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://thealignmentfield.com";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: service || "Spiritual Guidance Session",
            },
            unit_amount: 10000,
          },
          quantity: 1,
        },
      ],

      metadata: {
        selectedDate,
        selectedTime,
        service: service || "Spiritual Guidance Session",
      },

      success_url: `${baseUrl}/?success=true&date=${selectedDate}&time=${encodeURIComponent(
        selectedTime
      )}`,
      cancel_url: `${baseUrl}/?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe checkout error:", err?.message || err);
    return NextResponse.json(
      { error: err?.message || "Stripe error" },
      { status: 500 }
    );
  }
} 