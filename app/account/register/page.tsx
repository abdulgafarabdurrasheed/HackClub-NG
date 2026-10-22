import type { Metadata } from "next";
import Link from "next/link";
import { SiteFrame } from "@/components/SiteFrame";
import { getOutreachDatabaseStatus } from "@/lib/outreach-access";
import { registerOutreachAccount } from "./actions";

export const metadata: Metadata = { title: "Create outreach account" };

type Props = {
  searchParams: Promise<{ error?: string }>;
};

const errors: Record<string, string> = {
  details: "Check the details. Passwords must match and be at least 10 characters.",
  exists: "That username or email already has an account. Try signing in instead.",
  setup: "Account registration is unavailable until the outreach database setup is complete.",
};

export default async function RegisterPage({ searchParams }: Props) {
  const [{ error }, databaseStatus] = await Promise.all([
    searchParams,
    getOutreachDatabaseStatus(),
  ]);
  const ready = databaseStatus === "ready";

  return (
    <SiteFrame>
      <main id="main-content" className="page-container">
        <section className="sign-in-card account-card">
          <span className="eyebrow">Nigeria outreach team</span>
          <h1>Join the team.</h1>
          <p>
            Create an account to help record school visits, recommendations, and follow-ups. An
            admin reviews each request before workspace access is granted.
          </p>
          {!ready && (
            <div className="sign-in-message">
              <strong>Database setup is required.</strong> Run the two SQL files in order from the
              project folder: <code>drizzle/0000_outreach_hub.sql</code>, then{" "}
              <code>drizzle/0001_outreach_accounts.sql</code>.
            </div>
          )}
          {error && errors[error] && (
            <div className="form-alert" role="alert">
              {errors[error]}
            </div>
          )}
          {ready && (
            <form action={registerOutreachAccount} className="auth-form">
              <div className="field">
                <label htmlFor="name">Your name</label>
                <input id="name" name="name" autoComplete="name" minLength={2} maxLength={120} required />
              </div>
              <div className="field">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  name="username"
                  autoComplete="username"
                  minLength={3}
                  maxLength={30}
                  pattern="[A-Za-z0-9][A-Za-z0-9._-]{2,29}"
                  title="Use 3–30 letters, numbers, dots, underscores, or hyphens. Start with a letter or number."
                  required
                />
                <span className="field-hint">3–30 characters; letters, numbers, dots, _ and -.</span>
              </div>
              <div className="field">
                <label htmlFor="email">Email for account updates</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={254}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  minLength={10}
                  maxLength={128}
                  required
                />
                <span className="field-hint">Use at least 10 characters.</span>
              </div>
              <div className="field">
                <label htmlFor="confirmation">Confirm password</label>
                <input
                  id="confirmation"
                  name="confirmation"
                  type="password"
                  autoComplete="new-password"
                  minLength={10}
                  maxLength={128}
                  required
                />
              </div>
              <p className="privacy-note">
                We use your email for account and review updates. This workspace supports teen-led
                Hack Club activity in Nigeria; official applications and program decisions stay
                with <a href="https://hackclub.com/">Hack Club Global</a>.
              </p>
              <button className="button button-green auth-submit" type="submit">
                Request an account <span aria-hidden="true">→</span>
              </button>
            </form>
          )}
          <div className="form-actions" style={{ justifyContent: "center" }}>
            <Link className="button button-light" href="/account/sign-in">
              Already have an account? Sign in
            </Link>
          </div>
        </section>
      </main>
    </SiteFrame>
  );
}
