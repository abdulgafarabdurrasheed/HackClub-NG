import type { Metadata } from "next";
import { asc, eq } from "drizzle-orm";
import { AccountShell } from "@/components/AccountShell";
import { reviewOutreachAccount, setTeamMemberActive, updateTeamRole } from "@/app/account/actions";
import { db } from "@/lib/db";
import { outreachUsers } from "@/lib/db/schema";
import { requireOutreachAccess } from "@/lib/outreach-access";

export const metadata: Metadata = { title: "Outreach team" };
type Props = {
  searchParams: Promise<{ reviewed?: string; email?: string; error?: string }>;
};

const roleLabels: Record<string, string> = {
  super_admin: "Super admin",
  coordinator: "Coordinator",
  volunteer: "Volunteer",
};

function emailResult(email: string | undefined) {
  if (email === "sent") return " An update email was sent.";
  if (email === "not_configured")
    return " Email delivery is not configured; add RESEND_API_KEY and OUTREACH_FROM_EMAIL to send updates.";
  if (email === "failed") return " The status changed, but the update email could not be sent.";
  return "";
}

export default async function TeamPage({ searchParams }: Props) {
  const access = await requireOutreachAccess();
  const query = await searchParams;
  const members = db
    ? await db.select().from(outreachUsers).orderBy(asc(outreachUsers.name))
    : [];
  const pendingAccounts = db
    ? await db
        .select()
        .from(outreachUsers)
        .where(eq(outreachUsers.approvalStatus, "pending"))
        .orderBy(asc(outreachUsers.createdAt))
    : [];
  const isSuperAdmin = access.role === "super_admin";
  const currentMembers = members.filter((member) => member.approvalStatus !== "pending");
  const activeCount = members.filter(
    (member) => member.approvalStatus === "approved" && member.isActive,
  ).length;

  return (
    <AccountShell active="/account/team" name={access.name} email={access.email} role={access.role}>
      <div className="account-content">
        <div className="page-container">
          {query.reviewed && ["approved", "rejected"].includes(query.reviewed) && (
            <output className="form-alert form-success">
              Account {query.reviewed}.{emailResult(query.email)}
            </output>
          )}
          {query.error === "permission" && (
            <div className="form-alert">Only a super admin can review accounts or manage roles.</div>
          )}
          {query.error === "review" && (
            <div className="form-alert">That request is no longer pending. Refresh the list.</div>
          )}
          {query.error === "details" && (
            <div className="form-alert">That team change could not be saved.</div>
          )}

          <div className="account-section-heading" style={{ marginTop: 0 }}>
            <div>
              <h2>People doing the outreach</h2>
              <p>
                New accounts wait for admin approval. Approved teammates can coordinate school
                outreach; official Hack Club applications and program decisions stay with Hack Club
                Global.
              </p>
            </div>
            <span className="status-badge">{activeCount} active</span>
          </div>

          <div className="activity-card team-review-card">
            <div className="account-section-heading">
              <div>
                <h3>Account requests</h3>
                <p>{pendingAccounts.length} waiting for review</p>
              </div>
            </div>
            {isSuperAdmin ? (
              pendingAccounts.length ? (
                <div className="table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Username</th>
                        <th>Email for updates</th>
                        <th>Requested</th>
                        <th>Decision</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingAccounts.map((account) => {
                        const action = reviewOutreachAccount.bind(null, account.email);
                        return (
                          <tr key={account.email}>
                            <td>{account.name}</td>
                            <td>{account.username || "—"}</td>
                            <td>{account.email}</td>
                            <td>{account.createdAt.toLocaleDateString("en-NG")}</td>
                            <td>
                              <form action={action} className="row-actions">
                                <button
                                  className="mini-button"
                                  type="submit"
                                  name="decision"
                                  value="approved"
                                  aria-label={`Approve account for ${account.name}`}
                                >
                                  Approve
                                </button>
                                <button
                                  className="mini-button mini-button-danger"
                                  type="submit"
                                  name="decision"
                                  value="rejected"
                                  aria-label={`Decline account request for ${account.name}`}
                                >
                                  Decline
                                </button>
                              </form>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <strong>No requests waiting</strong>New account requests will appear here for review.
                </div>
              )
            ) : (
              <p className="privacy-note">Only super admins can view applicant details and review requests.</p>
            )}
          </div>

          <div className="account-section-heading">
            <div>
              <h2>Team accounts</h2>
              <p>Email addresses are used for account and approval updates.</p>
            </div>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Person</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Approval</th>
                  {isSuperAdmin && <th>Manage</th>}
                </tr>
              </thead>
              <tbody>
                {currentMembers.length ? (
                  currentMembers.map((member) => {
                    const roleAction = updateTeamRole.bind(null, member.email);
                    const activeAction = setTeamMemberActive.bind(null, member.email, !member.isActive);
                    const canManage =
                      isSuperAdmin &&
                      member.email !== access.email &&
                      member.approvalStatus === "approved" &&
                      member.role !== "super_admin";
                    return (
                      <tr key={member.email}>
                        <td>{member.name}</td>
                        <td>{member.username || "—"}</td>
                        <td>{member.email}</td>
                        <td>{roleLabels[member.role]}</td>
                        <td>
                          <span
                            className={`status-badge ${member.approvalStatus === "rejected" ? "status-blocked" : ""}`}
                          >
                            {member.approvalStatus === "approved" ? "Approved" : "Declined"}
                            {member.approvalStatus === "approved" && !member.isActive
                              ? " · Access removed"
                              : ""}
                          </span>
                        </td>
                        {isSuperAdmin && (
                          <td>
                            {canManage ? (
                              <div className="row-actions team-manage-actions">
                                <form action={roleAction} className="mini-form">
                                  <select name="role" defaultValue={member.role} aria-label={`Role for ${member.name}`}>
                                    <option value="volunteer">Volunteer</option>
                                    <option value="coordinator">Coordinator</option>
                                  </select>
                                  <button className="mini-button" type="submit">Save role</button>
                                </form>
                                <form action={activeAction}>
                                  <button className="mini-button" type="submit">
                                    {member.isActive ? "Remove access" : "Restore access"}
                                  </button>
                                </form>
                              </div>
                            ) : (
                              <span className="inline-muted">
                                {member.email === access.email
                                  ? "You"
                                  : member.role === "super_admin"
                                    ? "Super admin roles are managed in the database"
                                    : "No changes available"}
                              </span>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={isSuperAdmin ? 6 : 5}>
                      <div className="empty-state">
                        <strong>No approved or declined accounts yet</strong>
                        Register your first account, then promote it to super admin in the database.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {isSuperAdmin && (
            <p className="privacy-note">
              Roles are stored in the database. To establish the first super admin, register an
              account and run the one-time SQL shown in the README. Email updates need a configured
              Resend sender.
            </p>
          )}
        </div>
      </div>
    </AccountShell>
  );
}
