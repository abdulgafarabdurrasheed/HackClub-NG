import type { Metadata } from "next";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AccountShell } from "@/components/AccountShell";
import { OutreachPlanFields } from "@/components/OutreachPlanFields";
import { logSchoolActivity, updateSchool } from "@/app/account/actions";
import { db } from "@/lib/db";
import { outreachActivities, outreachUsers, schools } from "@/lib/db/schema";
import { requireOutreachAccess } from "@/lib/outreach-access";

export const metadata: Metadata = { title: "School outreach record" };
const statusLabels: Record<string, string> = {
  to_research: "To research",
  ready_to_visit: "Ready to visit",
  contacted: "Contacted",
  visited: "Visited",
  onboarded: "Onboarded",
  blocked: "Blocked",
  not_now: "Not now",
};
const activityKinds = ["visit", "call", "message", "event", "follow_up", "note"] as const;
type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; activity?: string; error?: string }>;
};

export default async function SchoolDetailPage({ params, searchParams }: Props) {
  const access = await requireOutreachAccess();
  const { id } = await params;
  const query = await searchParams;
  if (!db)
    return (
      <AccountShell
        active="/account/schools"
        name={access.name}
        email={access.email}
        role={access.role}
      >
        <div className="account-content">
          <div className="page-container">
            <div className="setup-banner">
              <strong>Database setup required</strong>
              <p>
                School records are not available until the outreach database has been connected.
              </p>
            </div>
          </div>
        </div>
      </AccountShell>
    );
  const [school] = await db.select().from(schools).where(eq(schools.id, id)).limit(1);
  if (!school) notFound();
  const [activities, members] = await Promise.all([
    db
      .select()
      .from(outreachActivities)
      .where(eq(outreachActivities.schoolId, id))
      .orderBy(desc(outreachActivities.happenedAt))
      .limit(100),
    db
      .select({
        email: outreachUsers.email,
        isActive: outreachUsers.isActive,
        approvalStatus: outreachUsers.approvalStatus,
      })
      .from(outreachUsers),
  ]);
  const updateAction = updateSchool.bind(null, id);
  const activityAction = logSchoolActivity.bind(null, id);

  return (
    <AccountShell
      active="/account/schools"
      name={access.name}
      email={access.email}
      role={access.role}
    >
      <div className="account-content">
        <div className="page-container">
          <div className="breadcrumb">
            <Link href="/account">Workspace</Link>
            <span>/</span>
            <Link href="/account/schools">Schools</Link>
            <span>/</span>
            <span>{school.name}</span>
          </div>
          {query.saved && <div className="form-alert form-success">School record updated.</div>}
          {query.activity && (
            <div className="form-alert form-success">Outreach activity logged.</div>
          )}
          {query.error && (
            <div className="form-alert">
              {query.error === "assignee"
                ? "The assigned email is not on the outreach team."
                : "Please check the details and try again."}
            </div>
          )}
          <div className="account-section-heading" style={{ marginTop: 5 }}>
            <div>
              <span className={`status-badge status-${school.status}`}>
                {statusLabels[school.status]}
              </span>
              <h2 style={{ marginTop: 10, fontSize: 28 }}>{school.name}</h2>
              <p>
                {school.city}, {school.state} · Added{" "}
                {school.createdAt.toLocaleDateString("en-NG", { timeZone: "Africa/Lagos" })} ·
                Source: {school.leadSource}
              </p>
            </div>
            <Link className="button button-light button-small" href="/account/schools">
              ← All schools
            </Link>
          </div>
          <div className="activity-layout">
            <section className="account-card">
              <h3>Outreach plan</h3>
              <form action={updateAction} className="form-grid">
                <OutreachPlanFields
                  initialStatus={school.status}
                  initialBarrier={school.barrier ?? ""}
                />
                <div className="field field-full">
                  <label htmlFor="resourceNotes">Resources / access notes</label>
                  <textarea
                    id="resourceNotes"
                    name="resourceNotes"
                    maxLength={1200}
                    defaultValue={school.resourceNotes ?? ""}
                    placeholder="Room, devices, power, internet, transport, or other practical conditions"
                  />
                </div>
                <div className="field field-full">
                  <label htmlFor="nextStep">Next step</label>
                  <input
                    id="nextStep"
                    name="nextStep"
                    maxLength={500}
                    defaultValue={school.nextStep ?? ""}
                    placeholder="Who will do what next?"
                  />
                </div>
                <div className="field">
                  <label htmlFor="nextStepAt">Review / follow-up date</label>
                  <input
                    id="nextStepAt"
                    name="nextStepAt"
                    type="date"
                    defaultValue={
                      school.nextStepAt?.toLocaleDateString("en-CA", {
                        timeZone: "Africa/Lagos",
                      }) ?? ""
                    }
                  />
                </div>
                <div className="field">
                  <label htmlFor="assignedEmail">Assign to team member</label>
                  <select
                    id="assignedEmail"
                    name="assignedEmail"
                    defaultValue={school.assignedEmail ?? ""}
                  >
                    <option value="">Unassigned</option>
                    {members
                      .filter(
                        (member) =>
                          (member.isActive && member.approvalStatus === "approved") ||
                          member.email === school.assignedEmail,
                      )
                      .map((member) => (
                        <option key={member.email} value={member.email}>
                          {member.email}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="field-full">
                  <button className="button button-green button-small" type="submit">
                    Save outreach plan
                  </button>
                </div>
              </form>
            </section>
            <section className="account-card">
              <h3>Log a visit or follow-up</h3>
              <p className="inline-muted">
                Add the outcome, who visited, what was agreed, and the next action. Don’t include
                student names or sensitive information.
              </p>
              <form action={activityAction} className="form-grid">
                <div className="field">
                  <label htmlFor="kind">Activity</label>
                  <select id="kind" name="kind" defaultValue="visit">
                    {activityKinds.map((kind) => (
                      <option key={kind} value={kind}>
                        {kind.replaceAll("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="happenedAt">
                    When <span className="inline-muted">(Nigeria time)</span>
                  </label>
                  <input id="happenedAt" name="happenedAt" type="datetime-local" />
                </div>
                <div className="field field-full">
                  <label htmlFor="attendees">
                    Other volunteers who took part <span className="inline-muted">(optional)</span>
                  </label>
                  <input
                    id="attendees"
                    name="attendees"
                    maxLength={500}
                    placeholder="Names or team emails; do not list students"
                  />
                </div>
                <div className="field field-full">
                  <label htmlFor="summary">What happened? *</label>
                  <textarea
                    id="summary"
                    name="summary"
                    required
                    minLength={3}
                    maxLength={1200}
                    placeholder="Keep it factual. What did the school ask for? What happens next?"
                  />
                </div>
                <div className="field-full">
                  <button className="button button-green button-small" type="submit">
                    Log activity
                  </button>
                </div>
              </form>
            </section>
          </div>
          <div className="account-section-heading">
            <div>
              <h2>Activity history</h2>
              <p>
                {activities.length} recent record{activities.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>
          <div className="activity-card">
            {activities.length ? (
              activities.map((activity) => (
                <div className="activity-item" key={activity.id}>
                  <strong>
                    {activity.kind.replaceAll("_", " ")} ·{" "}
                    {activity.happenedAt.toLocaleString("en-NG", {
                      dateStyle: "medium",
                      timeStyle: "short",
                      timeZone: "Africa/Lagos",
                    })}
                  </strong>
                  <p>{activity.summary}</p>
                  {activity.attendees && <small>Also present: {activity.attendees} · </small>}
                  <small>Logged by {activity.actorEmail}</small>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <strong>No visits or follow-ups logged yet</strong>Record the first conversation
                when it happens.
              </div>
            )}
          </div>
          <p className="privacy-note">
            An “onboarded” status here means the local outreach team believes the school has started
            participating. It is not Hack Club’s official club approval.
          </p>
        </div>
      </div>
    </AccountShell>
  );
}
