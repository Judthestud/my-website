import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { date, time } = await req.json();

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Spiritual Guidance Session",
            },
            unit_amount: 10000, 
          }, 
          quantity: 1,
        },
      ],

      metadata: {
        date,
        time,
      },

      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?success=true&date=${date}&time=${encodeURIComponent(time)}`, 
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
  console.error("Stripe checkout error:", err);
  return NextResponse.json({ error: "Stripe error" }, { status: 500 });
}  
} 