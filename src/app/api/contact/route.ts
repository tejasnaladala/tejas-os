import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * /api/contact
 *
 * Receives contact form submissions, validates them, applies a tiny in-memory
 * rate limit, and forwards via Resend. Falls back to instructing the client to
 * use a mailto: link if the API key is missing or the upstream send fails.
 *
 * Required env: RESEND_API_KEY  (set in Vercel project env, never committed)
 * Optional env: RESEND_FROM     (defaults to "Portfolio <noreply@parchmentlabs.com>")
 * Optional env: RESEND_TO       (defaults to "naladala@uw.edu")
 *
 * Rate limit: 5 requests per minute per IP. In-memory only, fine for low volume
 * portfolio traffic; swap to Upstash if this ever gets hammered.
 */

export const runtime = "nodejs";

const ContactSchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(120),
  message: z.string().trim().min(1).max(1500),
});

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const buckets = new Map<string, { count: number; reset: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(ip);
  if (!bucket || bucket.reset < now) {
    buckets.set(ip, { count: 1, reset: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (bucket.count >= RATE_LIMIT_MAX) return false;
  bucket.count += 1;
  return true;
}

function getIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: Request) {
  const ip = getIp(req);
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Try again in a minute." },
      { status: 429 }
    );
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const parsed = ContactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid input." },
      { status: 422 }
    );
  }

  const { name, email, message } = parsed.data;
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ ok: true, fallback: "mailto" });
  }

  const from = process.env.RESEND_FROM ?? "Portfolio <noreply@parchmentlabs.com>";
  const to = process.env.RESEND_TO ?? "naladala@uw.edu";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `Inbound from tejasnaladala.com: ${name}`,
        text: `${message}\n\nFrom: ${name} <${email}>`,
        reply_to: email,
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ ok: true, fallback: "mailto" });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true, fallback: "mailto" });
  }
}
