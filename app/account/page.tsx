import type { Metadata } from "next";
import { and, count, desc, eq, gte } from "drizzle-orm";
import Link from "next/link";
import { AccountShell } from "@/components/AccountShell";
import { db } from "@/lib/db";
import { outreachActivities, schoolRecommendations, schools } from "@/lib/db/schema";
import { requireOutreachAccess } from "@/lib/outreach-access";

export const metadata: Metadata = { title: "Outreach overview" };

const statusLabels: Record<string, string> = {
  to_research: "To research",
  ready_to_visit: "Ready to visit",
  contacted: "Contacted",
  visited: "Visited",
  onboarded: "Onboarded",
  blocked: "Blocked",
  not_now: "Not now",
};

function getMonthStart() {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Africa/Lagos",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(new Date());
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  return new Date(`${year}-${month}-01T00:00:00+01:00`);
}

export default async function AccountOverviewPage() {
  const access = await requireOutreachAccess();
  let stats = {
    schools: 0,
    visited: 0,
    onboarded: 0,
    blocked: 0,
    openRecommendations: 0,
    thisMonth: 0,
  };
  let recentSchools: (typeof schools.$inferSelect)[] = [];
  let recentActivities: (typeof outreachActivities.$inferSelect)[] = [];

  if (db) {
    const monthStart = getMonthStart();
    const [
      allSchools,
      visited,
      onboarded,
      blocked,
      openRecommendations,
      thisMonth,
      schoolRows,
      activities,
    ] = await Promise.all([
      db.select({ value: count() }).from(schools),
      db.select({ value: count() }).from(schools).where(eq(schools.status, "visited")),
      db.select({ value: count() }).from(schools).where(eq(schools.status, "onboarded")),
      db.select({ value: count() }).from(schools).where(eq(schools.status, "blocked")),
      db
        .select({ value: count() })
        .from(schoolRecommendations)
        .where(and(eq(schoolRecommendations.status, "new"))),
      db
        .select({ value: count() })
        .from(outreachActivities)
        .where(gte(outreachActivities.happenedAt, monthStart)),
      db.select().from(schools).orderBy(desc(schools.updatedAt)).limit(6),
      db.select().from(outreachActivities).orderBy(desc(outreachActivities.happenedAt)).limit(6),
    ]);
    stats = {
      schools: allSchools[0]?.value ?? 0,
      visited: visited[0]?.value ?? 0,
      onboarded: onboarded[0]?.value ?? 0,
      blocked: blocked[0]?.value ?? 0,
      openRecommendations: openRecommendations[0]?.value ?? 0,
      thisMonth: thisMonth[0]?.value ?? 0,
    };
    recentSchools = schoolRows;
    recentActivities = activities;
  }

  return (
    <AccountShell active="/account" name={access.name} email={access.email} role={access.role}>
      <div className="account-content">
        <div className="page-container">
          {!db && (
            <div className="setup-banner">
              <strong>Workspace database not connected</strong>
              <p>
                Hack Club sign-in is active, but outreach data needs <code>DATABASE_URL</code> and
                the SQL setup in <code>drizzle/0000_outreach_hub.sql</code>. Follow the setup guide
                in the project README.
              </p>
            </div>
          )}
          <div className="account-grid">
            <Stat
              label="Schools in pipeline"
              value={stats.schools}
              meta="Tracked by the outreach team"
            />
            <Stat
              label="Schools visited"
              value={stats.visited}
              meta="Marked visited in the pipeline"
            />
            <Stat
              label="Onboarded"
              value={stats.onboarded}
              meta="Still tracked as outreach, not HQ approval"
            />
            <Stat label="Blocked" value={stats.blocked} meta="Needs a barrier and a next step" />
          </div>
          <div className="account-section-heading">
            <div>
              <h2>Keep the next step visible</h2>
              <p>
                {stats.openRecommendations} new school recommendations · {stats.thisMonth} outreach
                activities this month
              </p>
            </div>
            <Link className="button button-green button-small" href="/account/schools">
              Add a school +
            </Link>
          </div>
          <div className="activity-layout">
            <div className="activity-card">
              <h3>Recently updated schools</h3>
              {recentSchools.length ? (
                recentSchools.map((school) => (
                  <div className="activity-item" key={school.id}>
                    <strong>
                      <Link href={`/account/schools/${school.id}`}>{school.name}</Link>{" "}
                      <span className={`status-badge status-${school.status}`}>
                        {statusLabels[school.status]}
                      </span>
                    </strong>
                    <p>
                      {school.city}, {school.state}
                      {school.nextStep ? ` · Next: ${school.nextStep}` : " · Add a next step"}
                    </p>
                    <small>
                      Updated{" "}
                      {school.updatedAt.toLocaleDateString("en-NG", { timeZone: "Africa/Lagos" })}
                    </small>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <strong>No schools in the pipeline yet</strong>Start with a school you have
                  permission to contact, or review recommendations from the community.
                </div>
              )}
            </div>
            <div className="activity-card">
              <h3>Recent outreach notes</h3>
              {recentActivities.length ? (
                recentActivities.map((activity) => (
                  <div className="activity-item" key={activity.id}>
                    <strong>
                      {activity.kind.replaceAll("_", " ")} ·{" "}
                      {activity.happenedAt.toLocaleDateString("en-NG", {
                        timeZone: "Africa/Lagos",
                      })}
                    </strong>
                    <p>{activity.summary}</p>
                    <small>{activity.actorEmail}</small>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <strong>Visits and follow-ups show up here</strong>Log each conversation so the
                  team can learn what is working and who owns the next step.
                </div>
              )}
            </div>
          </div>
          <div className="article-note" style={{ marginTop: 22 }}>
            <strong>Keep the boundary clear.</strong> This workspace records Nigeria outreach. A
            school marked “onboarded” here is not necessarily an officially approved Hack Club; only
            Hack Club Global can confirm that.
          </div>
        </div>
      </div>
    </AccountShell>
  );
}

function Stat({ label, value, meta }: { label: string; value: number; meta: string }) {
  return (
    <div className="stat-card">
      <div className="stat-label">
        <span>{label}</span>
        <span aria-hidden="true">↗</span>
      </div>
      <strong className="stat-value">{value}</strong>
      <span className="stat-meta">{meta}</span>
    </div>
  );
}
