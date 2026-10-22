import type { Metadata } from "next";
import { and, count, desc, eq, ilike, type SQL } from "drizzle-orm";
import Link from "next/link";
import { AccountShell } from "@/components/AccountShell";
import { Pagination } from "@/components/Pagination";
import { createSchool } from "@/app/account/actions";
import { db } from "@/lib/db";
import { schools } from "@/lib/db/schema";
import { nigeriaStates } from "@/lib/nigeria-states";
import { requireOutreachAccess } from "@/lib/outreach-access";

export const metadata: Metadata = { title: "Schools and visits" };

const schoolStatuses = [
  "to_research",
  "ready_to_visit",
  "contacted",
  "visited",
  "onboarded",
  "blocked",
  "not_now",
] as const;
const statusLabels: Record<string, string> = {
  to_research: "To research",
  ready_to_visit: "Ready to visit",
  contacted: "Contacted",
  visited: "Visited",
  onboarded: "Onboarded",
  blocked: "Blocked",
  not_now: "Not now",
};
type Props = {
  searchParams: Promise<{
    added?: string;
    error?: string;
    q?: string;
    state?: string;
    status?: string;
    page?: string;
  }>;
};

export default async function SchoolsPage({ searchParams }: Props) {
  const access = await requireOutreachAccess();
  const query = await searchParams;
  const q = (query.q ?? "").trim().slice(0, 120);
  const state = nigeriaStates.includes(query.state as (typeof nigeriaStates)[number])
    ? query.state
    : "";
  const status = schoolStatuses.includes(query.status as (typeof schoolStatuses)[number])
    ? query.status
    : "";
  const conditions: SQL[] = [];
  if (q) conditions.push(ilike(schools.name, `%${q}%`));
  if (state) conditions.push(eq(schools.state, state));
  if (status) conditions.push(eq(schools.status, status as (typeof schoolStatuses)[number]));
  const where = conditions.length ? and(...conditions) : undefined;
  const total = db
    ? ((await db.select({ value: count() }).from(schools).where(where))[0]?.value ?? 0)
    : 0;
  const totalPages = Math.max(1, Math.ceil(total / 100));
  const requestedPage = Number.parseInt(query.page ?? "1", 10);
  const currentPage = Math.min(
    totalPages,
    Math.max(1, Number.isFinite(requestedPage) ? requestedPage : 1),
  );
  const rows = db
    ? await db
        .select()
        .from(schools)
        .where(where)
        .orderBy(desc(schools.updatedAt))
        .limit(100)
        .offset((currentPage - 1) * 100)
    : [];
  return (
    <AccountShell
      active="/account/schools"
      name={access.name}
      email={access.email}
      role={access.role}
    >
      <div className="account-content">
        <div className="page-container">
          {query.added && (
            <div className="form-alert form-success">School added to the outreach pipeline.</div>
          )}
          {query.error === "details" && (
            <div className="form-alert">
              Check the school name, state, town, and source details.
            </div>
          )}
          {query.error === "missing" && (
            <div className="form-alert">That school record was not found.</div>
          )}
          {!db && (
            <div className="setup-banner">
              <strong>Database setup required</strong>
              <p>
                The workspace can’t save or load school records until <code>DATABASE_URL</code> is
                configured and the SQL in <code>drizzle/0000_outreach_hub.sql</code> has been
                applied.
              </p>
            </div>
          )}
          <div className="account-section-heading" style={{ marginTop: 0 }}>
            <div>
              <h2>Schools and outreach pipeline</h2>
              <p>
                Track who has been contacted, what is blocking progress, and the next agreed action.
              </p>
            </div>
            <span className="status-badge">{total} tracked</span>
          </div>
          <form action={createSchool} className="school-form">
            <div className="field">
              <label htmlFor="name">School / community name</label>
              <input
                id="name"
                name="name"
                required
                minLength={3}
                maxLength={160}
                placeholder="School name"
              />
            </div>
            <div className="field">
              <label htmlFor="state">State</label>
              <select id="state" name="state" required defaultValue="">
                <option value="" disabled>
                  Select
                </option>
                {nigeriaStates.map((state) => (
                  <option key={state}>{state}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Town / LGA</label>
              <input
                id="city"
                name="city"
                required
                minLength={2}
                maxLength={120}
                placeholder="Town or LGA"
              />
            </div>
            <div className="field">
              <label htmlFor="leadSource">How did we hear about it?</label>
              <input
                id="leadSource"
                name="leadSource"
                maxLength={160}
                placeholder="Volunteer / referral"
              />
            </div>
            <div className="field-full">
              <button className="button button-green button-small" type="submit">
                Add to pipeline +
              </button>
            </div>
          </form>
          <div className="account-section-heading">
            <div>
              <h2>All tracked schools</h2>
              <p>Open a school to update its status, barriers, assignments, and visit history.</p>
            </div>
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
            <select name="status" defaultValue={status} aria-label="Filter by pipeline status">
              <option value="">All statuses</option>
              {schoolStatuses.map((item) => (
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
                  <th>Location</th>
                  <th>Status</th>
                  <th>Next action</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {rows.length ? (
                  rows.map((school) => (
                    <tr key={school.id}>
                      <td>
                        <strong>
                          <Link href={`/account/schools/${school.id}`}>{school.name}</Link>
                        </strong>
                        <small>{school.leadSource}</small>
                      </td>
                      <td>
                        {school.city}, {school.state}
                      </td>
                      <td>
                        <span className={`status-badge status-${school.status}`}>
                          {statusLabels[school.status]}
                        </span>
                      </td>
                      <td>
                        {school.nextStep || <span className="inline-muted">Add next step</span>}
                        {school.nextStepAt && (
                          <small>Due {school.nextStepAt.toLocaleDateString("en-NG")}</small>
                        )}
                      </td>
                      <td>{school.updatedAt.toLocaleDateString("en-NG")}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5}>
                      <div className="empty-state">
                        <strong>No schools tracked yet</strong>Add a school the team has permission
                        to contact, or convert a recommendation from the inbox.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            hrefForPage={(page) => {
              const params = new URLSearchParams();
              if (q) params.set("q", q);
              if (state) params.set("state", state);
              if (status) params.set("status", status);
              params.set("page", String(page));
              return `/account/schools?${params.toString()}`;
            }}
          />
          <p className="privacy-note">
            Keep internal notes factual and minimal. Don’t record student names, personal
            circumstances, or sensitive information in school records.
          </p>
        </div>
      </div>
    </AccountShell>
  );
}
