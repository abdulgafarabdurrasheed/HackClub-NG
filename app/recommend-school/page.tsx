import type { Metadata } from "next";
import Link from "next/link";
import { SiteFrame } from "@/components/SiteFrame";
import { recommendSchool } from "@/app/actions/recommendation";
import { nigeriaStates } from "@/lib/nigeria-states";

export const metadata: Metadata = {
  title: "Recommend a school",
  description:
    "Privately recommend a Nigerian school for Hack Club outreach or request a local conversation.",
};

type Props = { searchParams: Promise<{ sent?: string; error?: string }> };

export default async function RecommendSchoolPage({ searchParams }: Props) {
  const { sent, error } = await searchParams;
  return (
    <SiteFrame>
      <main id="main-content">
        <section className="page-hero">
          <div className="page-container page-hero-inner">
            <div className="breadcrumb">
              <Link href="/">Home</Link>
              <span>/</span>
              <span>Recommend a school</span>
            </div>
            <span className="eyebrow">Connect a school to local support</span>
            <h1>Who should we talk to next?</h1>
            <p>
              Teens, teachers, parents, alumni, and community members can recommend a school or ask
              the Nigeria volunteer team for a visit.
            </p>
          </div>
        </section>
        <section className="page-container recommend-layout">
          <div className="form-card">
            {sent && (
              <output className="form-alert form-success">
                <strong>Thanks — your recommendation is with the team.</strong>
                <br />
                This is a private outreach request. It does not create a public school or club
                listing.
              </output>
            )}
            {error && (
              <div className="form-alert" role="alert">
                {error === "setup"
                  ? "The recommendation form is not connected yet. Please try again later."
                  : error === "details"
                    ? "Please check the school details and required fields, then submit again."
                    : "We couldn’t save this recommendation. Please try again in a moment."}
              </div>
            )}
            <form action={recommendSchool}>
              <div className="honeypot" aria-hidden="true">
                <label htmlFor="website">Leave this blank</label>
                <input id="website" name="website" tabIndex={-1} autoComplete="off" />
              </div>
              <div className="form-grid">
                <div className="field field-full">
                  <label htmlFor="schoolName">School or community name *</label>
                  <input
                    id="schoolName"
                    name="schoolName"
                    required
                    minLength={3}
                    maxLength={160}
                    placeholder="e.g. Community Secondary School"
                  />
                </div>
                <div className="field">
                  <label htmlFor="state">State / FCT *</label>
                  <select id="state" name="state" required defaultValue="">
                    <option value="" disabled>
                      Select a state
                    </option>
                    {nigeriaStates.map((state) => (
                      <option key={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="city">Town or LGA *</label>
                  <input
                    id="city"
                    name="city"
                    required
                    minLength={2}
                    maxLength={120}
                    placeholder="e.g. Abeokuta"
                  />
                </div>
                <div className="field">
                  <label htmlFor="schoolType">What kind of place?</label>
                  <select id="schoolType" name="schoolType" defaultValue="secondary">
                    <option value="secondary">Secondary school</option>
                    <option value="community">Community / youth group</option>
                    <option value="other">Library / community space</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="recommenderRole">I’m recommending as… *</label>
                  <select id="recommenderRole" name="recommenderRole" required defaultValue="">
                    <option value="" disabled>
                      Select one
                    </option>
                    <option value="student">A student</option>
                    <option value="teacher">A teacher / school staff member</option>
                    <option value="parent_or_guardian">A parent / guardian</option>
                    <option value="alumni">An alumnus / alumna</option>
                    <option value="community_member">A community member</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="contactName">
                    Your name <span className="inline-muted">(optional)</span>
                  </label>
                  <input id="contactName" name="contactName" maxLength={120} autoComplete="name" />
                </div>
                <div className="field field-full">
                  <label htmlFor="why">What would be useful for the team to know? *</label>
                  <textarea
                    id="why"
                    name="why"
                    required
                    minLength={8}
                    maxLength={1200}
                    placeholder="Is the school interested? Who should we ask for? What would make a visit useful? Please don’t include student names or sensitive information."
                  />
                  <span className="field-hint">
                    Please avoid sharing private information about students.
                  </span>
                </div>
                <div className="field field-full">
                  <label className="checkbox-field">
                    <input type="checkbox" name="wantsVisit" />
                    <span>
                      I’m asking the team to consider a school visit or information session.
                    </span>
                  </label>
                </div>
                <div className="field">
                  <label htmlFor="contactEmail">
                    Email for follow-up <span className="inline-muted">(optional)</span>
                  </label>
                  <input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    maxLength={254}
                    autoComplete="email"
                    placeholder="you@example.com"
                  />
                  <span className="field-hint">
                    Only provide an email if you are comfortable being contacted about this request.
                  </span>
                </div>
                <div className="field field-full">
                  <label className="checkbox-field">
                    <input type="checkbox" name="consentToContact" />
                    <span>
                      If I provided an email, I agree the Nigeria outreach team may use it to follow
                      up about this recommendation. I understand the recommendation is private and
                      won’t be published as a school or club listing.
                    </span>
                  </label>
                </div>
              </div>
              <div className="form-actions">
                <button className="button button-green" type="submit">
                  Send recommendation <span aria-hidden="true">→</span>
                </button>
              </div>
              <p className="privacy-note">
                The team uses this information to plan outreach and respond if you asked for
                follow-up. Don’t submit sensitive student information. Hack Club Nigeria is a local
                support effort; official applications and approvals are handled by{" "}
                <a href="https://hackclub.com/" target="_blank" rel="noreferrer">
                  Hack Club Global
                </a>
                .
              </p>
            </form>
          </div>
          <aside className="recommend-aside">
            <span className="eyebrow">What happens next</span>
            <h2>A recommendation is a starting point.</h2>
            <p>
              The outreach team reviews the request, checks the location and context, and decides
              whether it can follow up. Sending this form does not guarantee a visit.
            </p>
            <ul>
              <li>We won’t publish the school on a directory.</li>
              <li>We won’t ask for student names or phone numbers here.</li>
              <li>We’ll use a contact email only when you choose to share one and consent.</li>
              <li>Official Hack Club approval stays with Hack Club Global.</li>
            </ul>
          </aside>
        </section>
      </main>
    </SiteFrame>
  );
}
