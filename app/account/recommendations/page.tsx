import type { Metadata } from "next";
import { and, count, desc, eq, ilike, type SQL } from "drizzle-orm";
import { AccountShell } from "@/components/AccountShell";
import { Pagination } from "@/components/Pagination";
import { convertRecommendationToSchool, setRecommendationStatus } from "@/app/account/actions";
import { db } from "@/lib/db";
import { schoolRecommendations } from "@/lib/db/schema";
import { nigeriaStates } from "@/lib/nigeria-states";
import { requireOutreachAccess } from "@/lib/outreach-access";

export const metadata: Metadata = { title: "School recommendations" };
const statuses = ["new", "reviewing", "contacted", "converted", "closed"] as const;
const statusLabels: Record<string, string> = {
  new: "New",
  reviewing: "Reviewing",
  contacted: "Contacted",
  converted: "Added to pipeline",
  closed: "Closed",
};
type Props = {
  searchParams: Promise<{ q?: string; state?: string; status?: string; page?: string }>;
};

export default async function RecommendationsPage({ searchParams }: Props) {
  const access = await requireOutreachAccess();
  const query = await searchParams;
  const q = (query.q ?? "").trim().slice(0, 120);
  const state = nigeriaStates.includes(query.state as (typeof nigeriaStates)[number])
    ? query.state
    : "";
  const status = statuses.includes(query.status as (typeof statuses)[number]) ? query.status : "";
  const conditions: SQL[] = [];
  if (q) conditions.push(ilike(schoolRecommendations.schoolName, `%${q}%`));
  if (state) conditions.push(eq(schoolRecommendations.state, state));
  if (status)
    conditions.push(eq(schoolRecommendations.status, status as (typeof statuses)[number]));
  const where = conditions.length ? and(...conditions) : undefined;
  const [total, newCount] = db
    ? await Promise.all([
        db.select({ value: count() }).from(schoolRecommendations).where(where),
        db
          .select({ value: count() })
          .from(schoolRecommendations)
          .where(eq(schoolRecommendations.status, "new")),
      ])
    : [[{ value: 0 }], [{ value: 0 }]];
  const totalRows = total[0]?.value ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalRows / 100));
  const requestedPage = Number.parseInt(query.page ?? "1", 10);
  const currentPage = Math.min(
    totalPages,
    Math.max(1, Number.isFinite(requestedPage) ? requestedPage : 1),
  );
  const recommendations = db
    ? await db
        .select()
        .from(schoolRecommendations)
        .where(where)
        .orderBy(desc(schoolRecommendations.createdAt))
        .limit(100)
        .offset((currentPage - 1) * 100)
    : [];
  return (
    <AccountShell
      active="/account/recommendations"
      name={access.name}
      email={access.email}
      role={access.role}
    >
      <div className="account-content">
        <div className="page-container">
          {!db && (
            <div className="setup-banner">
              <strong>Database setup required</strong>
              <p>
                Recommendations can’t be saved or reviewed until the outreach database has been
                connected.
              </p>
            </div>
          )}
          <div className="account-section-heading" style={{ marginTop: 0 }}>
            <div>
              <h2>Community recommendations</h2>
              <p>
                Private requests from teens, teachers, parents, alumni, and community members.
                Review first; convert only when the team has a clear next step.
              </p>
            </div>
            <span className="status-badge">{newCount[0]?.value ?? 0} new</span>
          </div>
          <form className="utility-row" method="get">
            <input
              name="q"
              type="search"
              defaultValue={q}
              maxLength={120}
              placeholder="Search school name"
              aria-label="Search school name"
            />
            <select name="state" defaultValue={state} aria-label="Filter by state">
              <option value="">All states</option>
              {nigeriaStates.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <select name="status" defaultValue={status} aria-label="Filter by status">
              <option value="">All statuses</option>
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {statusLabels[item]}
                </option>
              ))}
            </select>
            <button className="mini-button" type="submit">
              Filter
            </button>
          </form>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>School</th>
                  <th>Recommended by</th>
                  <th>Why / visit request</th>
                  <th>Follow-up contact</th>
                  <th>Status</th>
                  <th>Team action</th>
                </tr>
              </thead>
              <tbody>
                {recommendations.length ? (
                  recommendations.map((recommendation) => {
                    const statusAction = setRecommendationStatus.bind(null, recommendation.id);
                    const convertAction = convertRecommendationToSchool.bind(
                      null,
                      recommendation.id,
                    );
                    return (
                      <tr key={recommendation.id}>
                        <td>
                          <strong>{recommendation.schoolName}</strong>
                          <small>
                            {recommendation.city}, {recommendation.state} ·{" "}
                            {recommendation.schoolType}
                          </small>
                          <small>Sent {recommendation.createdAt.toLocaleDateString("en-NG")}</small>
                        </td>
                        <td>
                          {recommendation.recommenderRole.replaceAll("_", " ")}
                          {recommendation.consentToContact && recommendation.contactName && (
                            <small>{recommendation.contactName}</small>
                          )}
                        </td>
                        <td>
                          {recommendation.why}
                          {recommendation.wantsVisit && (
                            <small>Asked about a visit / info session</small>
                          )}
                        </td>
                        <td>
                          {recommendation.consentToContact && recommendation.contactEmail ? (
                            <>
                              <strong>{recommendation.contactEmail}</strong>
                              <small>Contact consent recorded</small>
                            </>
                          ) : (
                            <span className="inline-muted">No follow-up email</span>
                          )}
                        </td>
                        <td>
                          <span className={`status-badge status-${recommendation.status}`}>
                            {statusLabels[recommendation.status]}
                          </span>
                          <form
                            action={statusAction}
                            className="mini-form"
                            style={{ marginTop: 8 }}
                          >
                            <select
                              name="status"
                              defaultValue={recommendation.status}
                              aria-label={`Status for ${recommendation.schoolName}`}
                            >
                              {statuses.map((status) => (
                                <option key={status} value={status}>
                                  {statusLabels[status]}
                                </option>
                              ))}
                            </select>
                            <button className="mini-button" type="submit">
                              Save
                            </button>
                          </form>
                        </td>
                        <td>
                          {recommendation.status === "converted" ? (
                            <span className="inline-muted">In school pipeline</span>
                          ) : (
                            <form action={convertAction}>
                              <button className="mini-button" type="submit">
                                Add as school lead
                              </button>
                            </form>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6}>
                      <div className="empty-state">
                        <strong>No recommendations yet</strong>New requests from the public form
                        will appear here. They are not published as club listings.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <p className="inline-muted">
            Showing {recommendations.length} of {totalRows} recommendations
          </p>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            hrefForPage={(page) => {
              const params = new URLSearchParams();
              if (q) params.set("q", q);
              if (state) params.set("state", state);
              if (status) params.set("status", status);
              params.set("page", String(page));
              return `/account/recommendations?${params.toString()}`;
            }}
          />
          <p className="privacy-note">
            Follow-up details are only shown when the person provided an email and consented to
            contact. Treat all recommendation content as private; use school permissions before
            arranging a visit.
          </p>
        </div>
      </div>
    </AccountShell>
  );
}
