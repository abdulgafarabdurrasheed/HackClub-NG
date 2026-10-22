import Link from "next/link";
import { GuideCard } from "@/components/GuideCard";
import { SiteFrame } from "@/components/SiteFrame";
import { guides } from "@/lib/guides";

export default function HomePage() {
  return (
    <SiteFrame>
      <main id="main-content">
        <section className="hero">
          <div className="page-container hero-grid">
            <div className="hero-copy">
              <span className="eyebrow">
                For Nigerian teens, By Nigerian teams
              </span>
              <h1>
                Make room for <em>more makers.</em>
              </h1>
              <p className="hero-lede">
                Practical help to start and sustain teen-led Hack Clubs in Nigerian HighSchools, and a way for
                people who care to connect schools with local volunteers.
              </p>
              <div className="hero-actions">
                <Link className="button button-green" href="/guides">
                  Explore the guides <span aria-hidden="true">→</span>
                </Link>
                <Link className="button button-light" href="/recommend-school">
                  Recommend a school
                </Link>
              </div>
              <p className="hero-note">
                A local support effort connected to Hack Club Global. Official club applications and
                program decisions stay with Hack Club.
              </p>
            </div>
            <div
              className="hero-art"
              aria-label="A reminder that small projects can start a community"
            >
              <div className="art-sticker">
                MAKE
                <br />
                TOGETHER
                <br />✳
              </div>
              <div className="art-card art-main">
                <div className="art-top">
                  <span>THE FIRST BUILD</span>
                  <span>01 / 04</span>
                </div>
                <h2>One idea can open a door.</h2>
                <p>
                  Bring a few curious people together. Make something small. Learn what your
                  community needs next.
                </p>
                <div className="art-pills">
                  <span>Curiosity</span>
                  <span>Projects</span>
                  <span>Community</span>
                </div>
              </div>
              <div className="art-card art-note">
                <strong>Start where you are.</strong>
                <span>Use what you have. Plan for what is missing.</span>
              </div>
              <div className="art-square" aria-hidden="true">
                ✳
              </div>
            </div>
          </div>
        </section>

        <div className="proof-strip">
          <div className="page-container proof-inner">
            <span className="proof-symbol" aria-hidden="true">
              ↗
            </span>
            <span>
              <strong>For teens by teens.</strong> Connected to a global community of young makers.
            </span>
          </div>
        </div>

        <section className="section" id="guides">
          <div className="page-container">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Field guide, not a rulebook</span>
                <h2>
                  Everything you need
                  <br />
                  for the next step.
                </h2>
              </div>
              <p>
                Start with the real conditions around you: school permission, shared devices, power,
                transport, and people willing to help. Then build a rhythm that can last.
              </p>
            </div>
            <div className="guide-grid">
              {guides.slice(0, 6).map((guide) => (
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
            <div className="section-heading" style={{ marginTop: 26, marginBottom: 0 }}>
              <span />
              <Link className="button button-link" href="/guides">
                See all guides <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="section section-tint">
          <div className="page-container">
            <div className="section-heading">
              <div>
                <span className="eyebrow">A club is people, not equipment</span>
                <h2>
                  Build with the conditions
                  <br />
                  you actually have.
                </h2>
              </div>
              <p>
                Some students have a lab, some share one device, and some are still looking for a
                safe place to meet. The plan should start with that truth.
              </p>
            </div>
            <div className="three-points">
              <div className="point">
                <span className="point-icon">✳</span>
                <b>Start with making</b>
                <p>
                  A tiny game, a web page, a story, or an unplugged design challenge can help people
                  discover what they want to learn next.
                </p>
              </div>
              <div className="point">
                <span className="point-icon">↔</span>
                <b>Share access fairly</b>
                <p>
                  Plan for shared computers, offline work, reliable power, venue permission, and
                  transport instead of assuming every member has a laptop and data.
                </p>
              </div>
              <div className="point">
                <span className="point-icon">◎</span>
                <b>Keep promises honest</b>
                <p>
                  Hack Club programs have their own rules. Check current eligibility and support
                  with the official organizers; no reward or funding is guaranteed.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="page-container callout">
            <div>
              <span className="eyebrow">Help the team show up</span>
              <h2>Know a school that wants a conversation?</h2>
              <p>
                Teens, teachers, parents, alumni, and community groups can tell the Nigeria
                volunteer team where a visit or follow-up would help. Recommendations are private
                outreach leads, not public club listings.
              </p>
            </div>
            <Link className="button" href="/recommend-school">
              Recommend a school <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        <section className="section section-tight section-tint">
          <div className="page-container callout" style={{ background: "var(--hub-green-dark)" }}>
            <div>
              <span className="eyebrow">Always linked to Hack Club Global</span>
              <h2>Local support. Global community.</h2>
              <p>
                This site helps with Nigerian context and outreach. Apply through Hack Club, explore
                current programs, and find the global community through Hack Club’s official
                channels.
              </p>
            </div>
            <a
              className="button"
              href="https://hackclub.com/clubs/"
              target="_blank"
              rel="noreferrer"
            >
              Explore Hack Club <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>
      </main>
    </SiteFrame>
  );
}
