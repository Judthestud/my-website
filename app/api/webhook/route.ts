import Stripe from "stripe";
import { NextResponse } from "next/server";
const nodemailer = require("nodemailer");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;

    const customerEmail = session.customer_details?.email;

    if (!customerEmail) return NextResponse.json({ received: true });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: customerEmail,
      subject: "Your Session Is Confirmed",
      text: `
Your session is confirmed.

Date: ${session?.metadata?.date || "Selected during booking"}
Time: ${session?.metadata?.time || "Selected during booking"}

Next step:
If you haven’t already completed your Pre-State Alignment Form, please do so here:
https://docs.google.com/forms/d/e/1FAIpQLSdFZKc8j4Y1TNEyZcRv5-rA82ScQskr52C44nC7hldkfKvTJw/viewform

If you already completed it, you’re all set.

Looking forward to connecting.

— Judson
      `,
    });

    console.log("Email sent to:", customerEmail);
  }

  return NextResponse.json({ received: true });
} 