import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

const FROM = "BreakawayRoping.Pro <support@breakawayroping.pro>";
const TEAM_INBOX = "support@breakawayroping.pro";
const CONFIRMATION_SUBJECT = "You're on the BreakawayRoping.Pro waitlist! 🤠";

/**
 * Deliberately permissive: it rejects the typos people actually make (missing
 * @, missing TLD, stray spaces) without bouncing the unusual but valid
 * addresses a stricter pattern would still get wrong.
 */
const EMAIL_PATTERN = /^[^\s@,;:<>()[\]\\]+@[^\s@.,;:<>()[\]\\]+(?:\.[^\s@.,;:<>()[\]\\]+)+$/;
const MAX_EMAIL_LENGTH = 254;

/**
 * Per-IP throttle. In-memory, so it resets on deploy and counts per serverless
 * instance — enough to blunt casual bot spam on a public form, not a substitute
 * for a shared limiter if the form is ever deliberately targeted.
 */
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;
const recentSubmissions = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const recent = (recentSubmissions.get(ip) ?? []).filter(
    (at) => now - at < RATE_WINDOW_MS,
  );
  recent.push(now);
  recentSubmissions.set(ip, recent);

  // Keep the map from growing without bound on a long-lived instance.
  if (recentSubmissions.size > 5000) {
    for (const [key, times] of recentSubmissions) {
      if (times.every((at) => now - at >= RATE_WINDOW_MS)) {
        recentSubmissions.delete(key);
      }
    }
  }

  return recent.length > RATE_LIMIT;
}

function clientIp(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for");
  return (
    forwarded?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown"
  );
}

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);
}

export async function POST(req: NextRequest) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { email, company } = (payload ?? {}) as {
    email?: unknown;
    company?: unknown;
  };

  // Honeypot. The field is hidden from real visitors, so anything in it came
  // from a bot — answer as if it worked rather than telling it what tripped.
  if (typeof company === "string" && company.trim() !== "") {
    return NextResponse.json({ success: true });
  }

  if (typeof email !== "string") {
    return NextResponse.json(
      { error: "Enter your email address." },
      { status: 400 },
    );
  }

  const address = email.trim().toLowerCase();
  if (address.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(address)) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 },
    );
  }

  if (!resendApiKey) {
    return NextResponse.json(
      { error: "Waitlist email service is not configured." },
      { status: 503 },
    );
  }

  if (isRateLimited(clientIp(req))) {
    return NextResponse.json(
      { error: "Too many signups from this connection. Try again in a minute." },
      { status: 429 },
    );
  }

  const resend = new Resend(resendApiKey);

  try {
    const confirmation = await resend.emails.send({
      from: FROM,
      to: address,
      replyTo: TEAM_INBOX,
      subject: CONFIRMATION_SUBJECT,
      html: `
        <div style="background-color:#070c15;color:#f2e8d5;padding:40px;font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <div style="text-align:center;margin-bottom:30px;">
            <h1 style="color:#d4af37;font-size:28px;margin:0;">BREAKAWAYROPING.PRO</h1>
            <p style="color:#8fa3bf;font-size:14px;margin-top:5px;">Two seconds to prove it.</p>
          </div>
          <h2 style="color:#d4af37;font-size:22px;">You're on the list! 🎉</h2>
          <p style="color:#c8d4e4;font-size:16px;line-height:1.6;">
            Thanks for signing up for early access to <strong style="color:#d4af37;">BreakawayRoping.Pro</strong> — the complete platform for breakaway ropers, producers, coaches, and families.
          </p>
          <p style="color:#c8d4e4;font-size:16px;line-height:1.6;">
            Breakaway is the fastest-growing event in rodeo and it still has no system of record. We're building one.
          </p>
          <h3 style="color:#d4af37;font-size:18px;margin-top:25px;">What's coming:</h3>
          <ul style="color:#c8d4e4;font-size:15px;line-height:1.8;">
            <li>🏆 Entries, draws, live results, and divisional payouts</li>
            <li>⏱️ A practice log that keeps hand times out of official results</li>
            <li>🪢 Equipment check — never lose a run to your string again</li>
            <li>⭐ Women's and junior groups, mentors, and the first-check board</li>
            <li>🐴 Horse profiles with breakaway role, stop rating, and arena stats</li>
            <li>🛒 A marketplace built for breakaway gear, calves, and horses</li>
            <li>🎯 AI run analysis: barrier margin, delivery, loop shape, slack</li>
            <li>❤️ Equine health, Coggins tracking, and biosecurity alerts</li>
            <li>🎓 NLBRA, NHSRA, NIRA standings, coaches, and scholarships</li>
          </ul>
          <p style="color:#c8d4e4;font-size:16px;line-height:1.6;">
            We'll keep you posted on launch updates. Keep swinging. 🤠
          </p>
          <p style="color:#8fa3bf;font-size:14px;margin-top:30px;">
            — The BreakawayRoping.Pro Team<br/>
            <a href="https://breakawayroping.pro" style="color:#d4af37;">breakawayroping.pro</a>
          </p>
          <hr style="border:none;border-top:1px solid #23374f;margin:30px 0;" />
          <p style="color:#5f7391;font-size:12px;text-align:center;">
            &copy; 2026 Apps 1, LLC. All rights reserved.
          </p>
        </div>
      `,
    });

    // Resend resolves with an `error` rather than throwing, so without this
    // check an unverified sending domain or a revoked key would look like a
    // successful signup to the visitor while no mail ever left the building.
    if (confirmation.error) {
      console.error("[waitlist] confirmation send failed", confirmation.error);
      return NextResponse.json(
        {
          error:
            "We couldn't send your confirmation email. Please try again shortly.",
        },
        { status: 502 },
      );
    }

    // The visitor is on the list once their confirmation is away. A failed team
    // ping is ours to spot in the logs, not theirs to retry.
    const notification = await resend.emails.send({
      from: FROM,
      to: TEAM_INBOX,
      replyTo: address,
      subject: "New Waitlist Signup!",
      html: `<p>New waitlist signup: <strong>${escapeHtml(address)}</strong></p>`,
    });

    if (notification.error) {
      console.error("[waitlist] team notification failed", notification.error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[waitlist] unexpected failure", error);
    return NextResponse.json(
      { error: "We couldn't sign you up just now. Please try again shortly." },
      { status: 500 },
    );
  }
}
