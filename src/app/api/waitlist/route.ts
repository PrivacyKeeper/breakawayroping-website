import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

function getResendClient() {
  if (!resendApiKey) {
    return null;
  }

  return new Resend(resendApiKey);
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const resend = getResendClient();
    if (!resend) {
      return NextResponse.json(
        { error: "Waitlist email service is not configured." },
        { status: 503 },
      );
    }

    await resend.emails.send({
      from: "BreakawayRoping.Pro <support@breakawayroping.pro>",
      to: email,
      subject: "You're on the BreakawayRoping.Pro waitlist! 🤠",
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

    // Also notify the team
    await resend.emails.send({
      from: "BreakawayRoping.Pro <support@breakawayroping.pro>",
      to: "support@breakawayroping.pro",
      subject: "New Waitlist Signup!",
      html: `<p>New waitlist signup: <strong>${email}</strong></p>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
