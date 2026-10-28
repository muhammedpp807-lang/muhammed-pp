import { NextResponse } from "next/server";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";

// Simple in-memory rate limiter per IP
const submissions = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000 * 15; // 15 minutes window
  const maxSubmissions = 5;

  const timestamps = (submissions.get(ip) || []).filter((time) => now - time < windowMs);
  if (timestamps.length >= maxSubmissions) {
    return true;
  }

  timestamps.push(now);
  submissions.set(ip, timestamps);
  return false;
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many messages sent. Please wait a few minutes before trying again." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, message } = body;

    // Strict validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ error: "Please enter a valid name (at least 2 characters)." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return NextResponse.json(
        { error: "Please enter a message of at least 10 characters." },
        { status: 400 }
      );
    }

    if (message.length > 5000) {
      return NextResponse.json({ error: "Message exceeds 5,000 character limit." }, { status: 400 });
    }

    // Insert into PostgreSQL database
    const [newMessage] = await db
      .insert(contactMessages)
      .values({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        message: message.trim(),
        isRead: false,
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: "Thank you, your message has been received! Muhammed PP will get back to you shortly.",
      id: newMessage.id,
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Database error occurred while saving your message. Please try again later." },
      { status: 500 }
    );
  }
}
