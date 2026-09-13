import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `Terms of Service — ${SITE.name}`,
  description: "The terms for working with Vilas Studio.",
};

// Same shape as /privacy: a standalone page, same visual language,
// header/back-link/container. Static — no data, no client code.
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

export default function TermsPage() {
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
          <h1 className="text-title font-display text-ink">Terms of Service</h1>
          <p className="mt-3 font-mono text-sm text-muted">
            Last updated: August 27, 2026
          </p>
          <p className="mt-6 max-w-xl text-muted leading-relaxed">
            These are the terms for working with Vilas Studio. Plain
            language, and they mean what they say.
          </p>

          <div className="mt-16 grid gap-10">
            <Section heading="What you're buying">
              <p className="max-w-xl text-muted leading-relaxed">
                A website, built by us, for your business. Pricing is a
                one-time build fee plus a monthly fee, quoted before we
                start. Nothing starts until we&rsquo;ve both agreed on scope
                and price in writing.
              </p>
            </Section>

            <Section heading="Payment">
              <p className="max-w-xl text-muted leading-relaxed">
                Half the build fee up front, half when the site is ready to
                go live. The monthly fee starts when the site launches. We
                send invoices through Stripe — you pay by card. If you cancel
                after we&rsquo;ve started building, the deposit isn&rsquo;t
                refunded; it covers the work already done. If we can&rsquo;t
                deliver a site you approve, we refund it.
              </p>
            </Section>

            <Section heading="What the monthly covers">
              <p className="max-w-xl text-muted leading-relaxed">
                Hosting, your domain registration, reasonable content
                updates — text, photos, hours, prices, new services, and
                the ongoing SEO work described on our site.
              </p>
              <p className="max-w-xl text-muted leading-relaxed">
                If a payment lapses, the site pauses until it&rsquo;s caught
                up. Nothing gets deleted, and your domain stays registered.
                After twelve months unpaid we may take the site offline and
                release the domain, and we&rsquo;ll email you first. Pay for
                the year up front and you get two months free. Annual
                payments don&rsquo;t auto-renew — we invoice you before year
                two.
              </p>
            </Section>

            <Section heading="Your domain">
              <p className="max-w-xl text-muted leading-relaxed">
                We register and hold your domain as part of the service.
                It&rsquo;s yours. If you leave, ask us and we&rsquo;ll
                transfer it to you at no charge.
              </p>
            </Section>

            <Section heading="Who owns what">
              <p className="max-w-xl text-muted leading-relaxed">
                You own your content — your text, photos, logo, and business
                information — and you own the finished site we deliver. We
                keep ownership of the underlying components, layouts, and
                code patterns we use across projects, and we reuse them on
                other builds.
              </p>
              <p className="max-w-xl text-muted leading-relaxed">
                We show finished work in our portfolio, on this site, and
                on social media. Tell us you&rsquo;d rather we didn&rsquo;t
                and we&rsquo;ll take it down.
              </p>
              <p className="max-w-xl text-muted leading-relaxed">
                Some parts of a site are licensed from other people —
                fonts, stock photos, generated video. Those licences cover
                your site. They don&rsquo;t transfer to you for other uses.
              </p>
            </Section>

            <Section heading="Your content">
              <p className="max-w-xl text-muted leading-relaxed">
                You&rsquo;re responsible for having the right to use
                anything you send us, and for the accuracy of your hours,
                prices, services, and claims. We&rsquo;ll build what you
                give us. We won&rsquo;t verify it. If someone comes after us
                over something you supplied, that&rsquo;s on you, and
                you&rsquo;ll cover what it costs us.
              </p>
            </Section>

            <Section heading="Revisions">
              <p className="max-w-xl text-muted leading-relaxed">
                We revise until you&rsquo;re happy with the build we agreed
                on. New sections, new pages, or a change in direction after
                approval is new work, quoted separately. If we send a
                preview and don&rsquo;t hear back for 14 days, we&rsquo;ll
                treat it as approved and send the final invoice.
              </p>
            </Section>

            <Section heading="What we don't promise">
              <p className="max-w-xl text-muted leading-relaxed">
                We don&rsquo;t guarantee search rankings, traffic, leads, or
                revenue. Local search takes months and depends on things
                outside anyone&rsquo;s control. Anyone who promises you
                otherwise is lying.
              </p>
              <p className="max-w-xl text-muted leading-relaxed">
                We build to reasonable modern standards, but we don&rsquo;t
                warrant that your site conforms to WCAG or any specific
                accessibility standard unless we&rsquo;ve agreed to that in
                writing as part of the scope.
              </p>
              <p className="max-w-xl text-muted leading-relaxed">
                We can&rsquo;t promise the site is never down. Hosting,
                domains, and email run on services we don&rsquo;t own, and
                they occasionally fail. We&rsquo;ll get it back up.
              </p>
            </Section>

            <Section heading="Your legal pages">
              <p className="max-w-xl text-muted leading-relaxed">
                Your site is your business. You&rsquo;re responsible for
                your own privacy policy, terms, and any other disclosures
                your business needs. We&rsquo;ll include a basic privacy
                page in the build; making sure it fits your business is on
                you.
              </p>
            </Section>

            <Section heading="Cancelling">
              <p className="max-w-xl text-muted leading-relaxed">
                Cancel the monthly any time. We&rsquo;ll transfer your
                domain and hand off your content. Build fees already paid
                aren&rsquo;t refundable once the site is delivered.
              </p>
            </Section>

            <Section heading="Liability">
              <p className="max-w-xl text-muted leading-relaxed">
                Our total liability for anything related to this work is
                limited to what you&rsquo;ve paid us in the previous twelve
                months.
              </p>
            </Section>

            <Section heading="Governing law">
              <p className="max-w-xl text-muted leading-relaxed">
                New York. Any dispute gets handled in the state or federal
                courts of Nassau County, New York.
              </p>
            </Section>

            <Section heading="Contact">
              <a
                href="mailto:hello.vilasstudio@gmail.com"
                className="text-ink/80 transition-colors duration-200 hover:text-accent"
              >
                hello.vilasstudio@gmail.com
              </a>
            </Section>
          </div>
        </div>
      </div>
    </main>
  );
}
