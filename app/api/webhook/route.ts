import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createZoomMeeting } from "@/lib/zoom";

const nodemailer = require("nodemailer");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook error:", err?.message || err);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const customerEmail = session.customer_details?.email;

    if (!customerEmail) {
      return NextResponse.json({ received: true });
    }

    const selectedDate =
      session.metadata?.selectedDate || "Selected during booking";

    const selectedTime =
      session.metadata?.selectedTime || "Selected during booking";

    const service =
      session.metadata?.service || "Spiritual Guidance Session";

    const zoomMeeting = await createZoomMeeting({
      topic: service,
      startTime: `${selectedDate}T14:00:00`,
      duration: 60,
    });

    const zoomLink = zoomMeeting?.join_url;

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
      subject: "Your Spiritual Guidance Session Is Confirmed",
      text: `
Your session is confirmed.

Service: ${service}
Date: ${selectedDate}
Time: ${selectedTime}

Zoom Link:
${zoomLink || "Zoom link will be sent shortly."}

Please arrive a few minutes early and come with an open mind.

Looking forward to connecting.

- Judson
`,
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "New Paid Spiritual Guidance Session",
      text: `
New session booked.

Client Email: ${customerEmail}

Service: ${service}
Date: ${selectedDate}
Time: ${selectedTime}

Zoom Link:
${zoomLink || "Zoom link unavailable."}

- System
`,
    });

    console.log("Zoom link emails sent successfully");
  }

  return NextResponse.json({ received: true });
} 