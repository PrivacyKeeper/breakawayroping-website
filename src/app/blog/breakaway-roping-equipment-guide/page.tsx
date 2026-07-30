import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Breakaway Roping Equipment: The Rule That Disqualifies You",
  description:
    "WPRA 12.10.9 requires #18 mason line, a minimum of three knots, and a 12x12 bright flag. Judges check at random, and an equipment DQ voids a time you have already posted.",
  keywords:
    "breakaway roping equipment, WPRA 12.10.9, breakaway string rule, #18 mason line, breakaway flag rule, breakaway honda, breakaway roping gear",
  alternates: {
    canonical:
      "https://www.breakawayroping.pro/blog/breakaway-roping-equipment-guide",
  },
};

export default function Post() {
  return (
    <article className="prose-arena">
      <p className="text-xs tracking-wider text-muted-dim uppercase">
        30 July 2026
      </p>
      <h1 className="mt-2 mb-6 text-3xl font-extrabold text-gold">
        Breakaway Roping Equipment: The Rule That Disqualifies You
      </h1>

      <p>
        Most rules cost you a run. This one costs you a run you already won.
      </p>

      <p>
        An equipment disqualification in breakaway lands <em>after</em> the run
        and after the time is posted. You can rope clean, see your name at the
        top of the board, and lose it to a string that was not built to spec. It
        is the single most avoidable loss in the event, and it happens every
        season.
      </p>

      <h2>The specification</h2>

      <p>
        This is WPRA rule 12.10.9, amended 1 October 2025 and current for the
        2026 season.
      </p>

      <h3>The string</h3>
      <p>
        The rope is tied at the end of the rope to the saddle horn with{" "}
        <strong>#18 brightly colored twisted or braided mason line string</strong>
        , fully intact, secured with a <strong>minimum of three knots</strong>.
      </p>
      <p>
        Every part of that sentence is enforceable. The gauge is #18. The line
        must be fully intact — not a piece you salvaged off a run last weekend.
        Three knots is a floor, not a suggestion. And it is subject to random
        checks by judges. Failure to use proper equipment is a{" "}
        <strong>disqualification</strong>.
      </p>

      <h3>The flag</h3>
      <p>
        A bright solid color cloth, <strong>minimum 12 inches by 12 inches</strong>
        , must be attached to the end of the rope. Suggested colors are neon
        yellow, neon pink, neon orange, neon green, or clean bright white.
      </p>
      <p>
        The flag exists because the flag is what the timer watches. Your run ends
        when the string breaks off the horn, and the cloth is what makes that
        moment visible from the timer&apos;s stand. Noncompliance here is a minor
        rule violation which judges may turn in — less severe than the string,
        but still a violation.
      </p>

      <h3>Everything else</h3>
      <ul>
        <li>
          The rope may not pass through a bridle, tie-down, neck rope, or any
          other device
        </li>
        <li>
          Calf neck ropes must be tied with string, and an adjustable slide is
          used on all neck ropes for cattle used in breakaway
        </li>
      </ul>

      <h2>The two-loop trap</h2>

      <p>
        If your class allows two loops, your second rope has to be independently
        strung to the horn to be usable. And here is the part that catches
        people: <strong>if the string already broke on your first throw, that
        rope cannot be rebuilt for a second throw.</strong> You need the second
        rope built and strung before you ever back in the box.
      </p>

      <h2>Build a habit, not a hope</h2>

      <p>
        The reason this rule bites good ropers is that string is a consumable.
        You go through it constantly, you rebuild in a hurry between runs, and
        the check is random — so ninety-nine times out of a hundred nothing
        happens and the habit erodes.
      </p>

      <p>The checklist that prevents it takes fifteen seconds:</p>

      <ol>
        <li>Confirm the gauge — #18, not whatever was in the trailer</li>
        <li>Count the knots out loud. Three minimum</li>
        <li>Check the line is fully intact along its length</li>
        <li>Confirm the flag is a solid bright color and at least 12x12</li>
        <li>Confirm the rope runs clean, through no tack or device</li>
        <li>If it is a two-loop class, confirm the second rope is strung</li>
      </ol>

      <p>
        We built this into the app as a pre-run equipment check with photo
        capture of the flag and the knot count, timestamped and stored. It takes
        a few seconds, it gives you a judge-ready record when a random check
        comes, and it prevents the one disqualification in this event that is
        entirely within your control.
      </p>

      <p>
        <Link href="/rules">See the full rules and penalty table &rarr;</Link>
      </p>
    </article>
  );
}
