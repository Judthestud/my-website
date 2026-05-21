import { NextResponse } from "next/server";
const nodemailer = require("nodemailer");

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
  name,
  email,
  focus,
  awareness,
  intention,
  country,
  recentFeelings,
  desiredOutcome,
  availability,
} = body; 

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 🔥 1. SEND FORM RESULTS TO YOU
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "New Spiritual Guidance Form Submission",
     text: `
New Spiritual Guidance Form Submission

Name: ${name}
Email: ${email}
Country: ${country}

Focus: ${focus}
Awareness: ${awareness}
Recent Feelings: ${recentFeelings}
Desired Outcome: ${desiredOutcome}
Availability: ${availability?.join(", ")}

Intention:
${intention}
`, 
    });

    // 🔥 2. SEND CONFIRMATION TO CLIENT
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your form has been received",
      text: `
Thanks for completing your Spiritual Guidance form.

You're all set for your session.

— Judson
`,
    });

    console.log("Form emails sent successfully");

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Form error:", error);
    return NextResponse.json({ error: "Failed to send form" }, { status: 500 });
  }
} 