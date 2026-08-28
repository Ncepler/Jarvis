import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `Privacy Policy — ${SITE.name}`,
  description: "What we collect, why, and what we do with it.",
};

// Same shape as /start and /updates: a standalone page, same visual
// language, header/back-link/container. Static — no data, no client code.
// Analytics paragraph is intentionally absent (no analytics run on this
// site as of writing) — add it back if that changes.
function Section({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-3">
      <h2 className="font-mono text-[13px] font-semibold uppercase tracking-[0.16em] text-accent">
        {heading}
      </h2>
      {children}
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen px-6 py-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="text-sm text-muted transition-colors duration-200 hover:text-ink"
        >
          ← {SITE.name}
        </Link>

        <div className="mt-8">
          <h1 className="text-title font-display text-ink">Privacy Policy</h1>
          <p className="mt-3 font-mono text-sm text-muted">
            Last updated: August 27, 2026
          </p>
          <p className="mt-6 max-w-xl text-muted leading-relaxed">
            This is a plain explanation of what we collect, why, and what we
            do with it. Vilas Studio is a web design studio operating in the
            United States.
          </p>

          <div className="mt-16 grid gap-10">
            <Section heading="What we collect">
              <p className="max-w-xl text-muted leading-relaxed">
                When you fill out our intake form, we collect your business
                name, your name, your business email, your phone number if
                you give it, your business address or service area, the
                domain you want, and whatever else you tell us about your
                business. When you use
                our project lookup, we collect the reference code and email
                you enter.
              </p>
              <p className="max-w-xl text-muted leading-relaxed">
                If you email us, we keep the email.
              </p>
            </Section>

            <Section heading="Why we collect it">
              <p className="max-w-xl text-muted leading-relaxed">
                To answer you, to quote the work, to build your site, and to
                run your project. That&rsquo;s it. We don&rsquo;t sell it,
                rent it, or share it with anyone for advertising.
              </p>
            </Section>

            <p className="max-w-xl text-muted leading-relaxed">
              This policy covers vilas.studio only. Sites we build for
              clients are run by those clients and have their own policies.
            </p>

            <Section heading="Who else sees it">
              <p className="max-w-xl text-muted leading-relaxed">
                We use a small number of service providers to run the
                studio. Each one only sees what it needs to:
              </p>
              <ul className="max-w-xl list-disc gap-2 pl-5 text-muted leading-relaxed [&>li]:mt-2">
                <li>Vercel, which hosts this site and keeps standard server logs</li>
                <li>Supabase, which stores intake submissions and project records</li>
                <li>Resend, which sends the emails our forms generate</li>
                <li>Stripe, which processes payments when you pay an invoice</li>
              </ul>
              <p className="max-w-xl text-muted leading-relaxed">
                We don&rsquo;t share personal information with anyone for
                their own direct marketing.
              </p>
            </Section>

            <Section heading="Cold outreach">
              <p className="max-w-xl text-muted leading-relaxed">
                If we emailed you first, we found your business through
                public sources — Google Business Profile, your website,
                business directories, or a business contact data provider.
                We keep your business name, email, and public listing
                details so we don&rsquo;t contact you twice. Reply &ldquo;no
                thanks&rdquo; or &ldquo;unsubscribe&rdquo; to any email from
                us and we stop contacting you and delete you from our list.
                No follow-up, no exceptions.
              </p>
            </Section>

            <Section heading="Do Not Track">
              <p className="max-w-xl text-muted leading-relaxed">
                We don&rsquo;t track visitors across other websites, so
                there is nothing for a Do Not Track signal to turn off. We
                don&rsquo;t allow third parties to track visitors across
                other sites through this one.
              </p>
            </Section>

            <Section heading="How long we keep it">
              <p className="max-w-xl text-muted leading-relaxed">
                Intake submissions and project records: for as long as
                you&rsquo;re a client, and two years after. Cold outreach
                records: until you opt out, then only enough to keep you off
                the list. Ask us to delete anything sooner and we will,
                unless we&rsquo;re required to keep it.
              </p>
            </Section>

            <Section heading="Security">
              <p className="max-w-xl text-muted leading-relaxed">
                We keep your information on password-protected,
                access-controlled services and only give access to people
                who need it to do the work. No system is perfect, but we
                take this seriously and we&rsquo;d tell you promptly if
                something went wrong.
              </p>
            </Section>

            <Section heading="Children">
              <p className="max-w-xl text-muted leading-relaxed">
                This site is for business owners. We don&rsquo;t knowingly
                collect personal information from anyone under 16.
              </p>
            </Section>

            <Section heading="Your choices">
              <p className="max-w-xl text-muted leading-relaxed">
                Email us and we&rsquo;ll tell you what we have on you,
                correct it, or delete it. No form to fill out.
              </p>
            </Section>

            <Section heading="Changes">
              <p className="max-w-xl text-muted leading-relaxed">
                If we change this policy in a way that matters, we&rsquo;ll
                update the date at the top and post the new version here
                before it takes effect.
              </p>
            </Section>

            <Section heading="Contact">
              <a
                href={`mailto:${SITE.email}`}
                className="text-ink/80 transition-colors duration-200 hover:text-accent"
              >
                {SITE.email}
              </a>
            </Section>
          </div>
        </div>
      </div>
    </main>
  );
}
