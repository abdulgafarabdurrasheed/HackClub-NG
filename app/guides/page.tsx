import Link from "next/link";
import { GuideCard } from "@/components/GuideCard";
import { SiteFrame } from "@/components/SiteFrame";
import { guides } from "@/lib/guides";

export const metadata = {
  title: "Guides",
  description: "Practical guides for starting and sustaining teen-led Hack Clubs in Nigeria.",
};

export default function GuidesPage() {
  return (
    <SiteFrame>
      <main id="main-content">
        <section className="page-hero">
          <div className="page-container page-hero-inner">
            <div className="breadcrumb">
              <Link href="/">Home</Link>
              <span>/</span>
              <span>Guides</span>
            </div>
            <span className="eyebrow">Field notes for organizers</span>
            <h1>Practical, honest, made to adapt.</h1>
            <p>
              Use these guides as a starting point. Every school and community is different, and
              official Hack Club requirements can change. Follow the current global guidance whenever
              it matters.
            </p>
          </div>
        </section>
        <section className="section">
          <div className="page-container">
            <div className="guide-grid">
              {guides.map((guide) => (
                <GuideCard
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  number={guide.number}
                  title={guide.title}
                  description={guide.description}
                  tag={guide.tag}
                />
              ))}
            </div>
          </div>
        </section>
        <section className="section section-tight section-tint">
          <div className="page-container callout">
            <div>
              <span className="eyebrow">Need a local follow-up?</span>
              <h2>Tell us where support would help.</h2>
              <p>Recommend a school or request a conversation with the Nigeria volunteer team.</p>
            </div>
            <Link className="button" href="/recommend-school">
              Recommend a school →
            </Link>
          </div>
        </section>
      </main>
    </SiteFrame>
  );
}
