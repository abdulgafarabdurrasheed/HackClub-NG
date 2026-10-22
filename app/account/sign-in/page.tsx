import type { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { OutreachSignInForm } from "@/components/OutreachSignInForm";
import { SignOutButton } from "@/components/SignOutButton";
import { SiteFrame } from "@/components/SiteFrame";
import { authOptions } from "@/lib/auth";
import {
  getOutreachAccess,
  getOutreachAccountStatus,
  getOutreachDatabaseStatus,
} from "@/lib/outreach-access";

export const metadata: Metadata = { title: "Outreach team sign in" };
type Props = {
  searchParams: Promise<{
    registered?: string;
    email?: string;
    denied?: string;
    error?: string;
  }>;
};

export default async function SignInPage({ searchParams }: Props) {
  const query = await searchParams;
  const session = await getServerSession(authOptions);
  const databaseStatus = await getOutreachDatabaseStatus();
  const accountStatus =
    databaseStatus === "ready" && session?.user?.email
      ? await getOutreachAccountStatus(session.user.email)
      : null;
  const access = databaseStatus === "ready" ? await getOutreachAccess() : null;
  if (access) redirect("/account");

  const configured = Boolean(process.env.NEXTAUTH_SECRET);
  const emailUpdatesConfigured = Boolean(
    process.env.RESEND_API_KEY && process.env.OUTREACH_FROM_EMAIL,
  );
  const waitingForReview = accountStatus === "pending";
  const accountUnavailable = accountStatus === "rejected" || accountStatus === "inactive";

  return (
    <SiteFrame>
      <main id="main-content" className="page-container">
        <section className="sign-in-card account-card">
          <span className="eyebrow">For the Nigeria outreach team</span>
          <h1>Keep the work moving.</h1>
          <p>
            Sign in to record school conversations, visits, blockers, recommendations, and next
            steps. An admin must approve new accounts before they can access the workspace.
          </p>
          {databaseStatus !== "ready" && (
            <div className="sign-in-message">
              {databaseStatus === "not_configured" ? (
                <>
                  <strong>Outreach database is not connected.</strong> Set <code>DATABASE_URL</code>
                  in the server environment, then run both SQL migrations from the project folder.
                </>
              ) : (
                <>
                  <strong>Outreach database setup is incomplete.</strong> From the project folder,
                  run <code>psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f drizzle/0000_outreach_hub.sql</code>,
                  then run the same command with <code>drizzle/0001_outreach_accounts.sql</code>.
                </>
              )}
            </div>
          )}
          {!configured && (
            <div className="sign-in-message">
              Set <code>NEXTAUTH_SECRET</code> in the server environment before enabling account
              sign-in.
            </div>
          )}
          {query.registered && (
            <output className="form-alert form-success">
              Your account request is in. An admin needs to approve it before you can enter the
              workspace.
              {query.email === "sent" && " We sent an update to your email."}
              {query.email === "not_configured" &&
                " Email delivery is not configured yet; you can sign in here to check its status."}
              {query.email === "failed" &&
                " We could not send the email update, but your request was saved."}
            </output>
          )}
          {waitingForReview && (
            <output className="form-alert">
              Your account is awaiting admin approval.
              {emailUpdatesConfigured
                ? " We’ll email you when its status changes."
                : " Email delivery is not configured yet; sign in here to check its status."}
            </output>
          )}
          {accountUnavailable && (
            <div className="form-alert" role="alert">
              {accountStatus === "rejected"
                ? "An admin could not approve this account. Contact the outreach team if you think this was a mistake."
                : "Workspace access for this account is currently disabled. Contact the outreach team for help."}
            </div>
          )}
          {query.denied && (!accountStatus || accountStatus === "approved") && (
            <div className="form-alert" role="alert">
              This session was not created by an outreach account, or it does not have approved
              workspace access. Sign in with your outreach username/email and password.
            </div>
          )}
          {query.error === "CredentialsSignin" && (
            <div className="form-alert" role="alert">
              Those sign-in details didn’t match. Check your username or email and password.
            </div>
          )}
          {databaseStatus === "ready" && configured && !waitingForReview && !accountUnavailable && (
            <OutreachSignInForm />
          )}
          {(waitingForReview || accountUnavailable) && (
            <div className="form-actions" style={{ justifyContent: "center" }}>
              <SignOutButton />
            </div>
          )}
          {databaseStatus === "ready" && (
            <p className="privacy-note">
              New to the outreach team? <Link href="/account/register">Request an account</Link>.
              Your email is used for account and review updates. This workspace supports Hack Club
              Global’s teen-led community in Nigeria.
            </p>
          )}
          <div className="form-actions" style={{ justifyContent: "center" }}>
            <Link className="button button-light" href="/">
              Back to public guides
            </Link>
          </div>
        </section>
      </main>
    </SiteFrame>
  );
}
