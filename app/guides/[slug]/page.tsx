import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFrame } from "@/components/SiteFrame";
import { guides } from "@/lib/guides";

type GuidePageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return guides.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = guides.find((item) => item.slug === slug);
  if (!guide) return {};
  return { title: guide.title, description: guide.description };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = guides.find((item) => item.slug === slug);
  if (!guide) notFound();

  return (
    <SiteFrame>
      <main id="main-content">
        <section className="page-hero">
          <div className="page-container page-hero-inner">
            <div className="breadcrumb">
              <Link href="/">Home</Link>
              <span>/</span>
              <Link href="/guides">Guides</Link>
              <span>/</span>
              <span>{guide.tag}</span>
            </div>
            <span className="eyebrow">
              {guide.number} · {guide.tag}
            </span>
            <h1>{guide.title}</h1>
            <p>{guide.description}</p>
          </div>
        </section>
        <section className="section">
          <div className="page-container guide-body">
            <article className="article">
              <p>{guide.intro}</p>
              <div className="article-note">
                <strong>Keep these in view</strong>
                <ul>
                  {guide.takeaways.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              {guide.sections.map((section) => (
                <section key={section.title}>
                  <h2>{section.title}</h2>
                  {section.paragraphs?.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.bullets && (
                    <ul>
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                  {section.callout && <div className="article-note">{section.callout}</div>}
                </section>
              ))}
              <p>
                These are local support notes, not Hack Club policy. For official club applications,
                program rules, funding, or approvals, follow the current information from{" "}
                <a href="https://hackclub.com/" target="_blank" rel="noreferrer">
                  Hack Club Global
                </a>
                .
              </p>
              <Link className="button button-light" href="/guides">
                ← All guides
              </Link>
            </article>
            <aside className="side-panel">
              <h3>Official Hack Club resources</h3>
              {guide.resources.map((resource) => (
                <div key={resource.href}>
                  <a
                    href={resource.href}
                    target={resource.href.startsWith("http") ? "_blank" : undefined}
                    rel={resource.href.startsWith("http") ? "noreferrer" : undefined}
                  >
                    {resource.label} {resource.href.startsWith("http") ? "↗" : "→"}
                  </a>
                  <small>{resource.note}</small>
                </div>
              ))}
              <hr />
              <small>
                Always confirm details on the official page. Program rules, eligibility, and
                available support may change.
              </small>
            </aside>
          </div>
        </section>
        <section className="section section-tight section-tint">
          <div className="page-container callout">
            <div>
              <span className="eyebrow">Put local knowledge to work</span>
              <h2>Know a school that wants to explore this?</h2>
              <p>
                Share a school recommendation with the outreach team. We’ll use it for follow-up,
                not publish it as a club listing.
              </p>
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
