# Hack Club Nigeria outreach hub

A Nigeria-focused guide and outreach workspace connected to [Hack Club Global](https://hackclub.com/). The public site helps teens, educators, families, and volunteers understand how to start and sustain a teen-led making community. The private workspace helps authorized organizers keep track of school conversations, recommendations, visits, blockers, and follow-ups.

This project is **not** a club directory, club approval system, or replacement for Hack Club HQ. Official club applications, eligibility, program rules, funding decisions, and approvals belong to Hack Club Global. Local status such as “onboarded” means the outreach team has recorded participation; it does not mean HQ approved a club.

## Local development

Requires Node.js 20.9 or later and npm.

```sh
npm install
npm run dev
```

The public guides and school recommendation form can be viewed without sign-in. The outreach workspace uses username/email and password accounts backed by PostgreSQL. New accounts stay pending until a database-backed super admin approves them; no Hack Club account is required.

## Environment

Create `.env.local` with server-side values:

```dotenv
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace-with-a-long-random-secret
DATABASE_URL=postgres://...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SITE_URL=http://localhost:3000
RESEND_API_KEY=...
OUTREACH_FROM_EMAIL=outreach@example.com
```

- `NEXTAUTH_SECRET` signs the local account sessions. Generate a long random value and keep it server-only.
- `DATABASE_URL` should point to a PostgreSQL database. The app does not connect to a guessed local default when it is missing.
- `RESEND_API_KEY` and `OUTREACH_FROM_EMAIL` are optional. Configure them with a verified sender to email account request, approval, and decline updates. Without them, users can still check their request status after signing in.
- Set `NEXT_PUBLIC_SITE_URL` and `SITE_URL` to the deployed origin. Do not assume a Hack Club subdomain has been approved.

## Database setup

Run both additive SQL migrations in order. They create the outreach workspace and account approval fields without dropping legacy tables or erasing existing rows:

```sh
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f drizzle/0000_outreach_hub.sql
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f drizzle/0001_outreach_accounts.sql
```

### Set the first super admin

Register your own account at `/account/register`. Then promote that account once in PostgreSQL, replacing the email with the one you registered:

```sql
UPDATE outreach_users
SET role = 'super_admin',
    approval_status = 'approved',
    is_active = true,
    reviewed_by = lower('admin@example.com'),
    reviewed_at = now()
WHERE email = lower('admin@example.com');
```

After that, super admins can approve or decline requests and manage volunteer/coordinator roles from **Team**. Super admin roles remain database-controlled. The public form stores school recommendations as private outreach leads. Avoid putting student names or sensitive information into internal notes.

## Product areas

- `/` — explain the Nigeria support effort and route people into useful next steps.
- `/guides` — starting a club, first meetups, flexible curriculum, YSWS, low-resource access, school outreach, and sustainable organizing.
- `/recommend-school` — private recommendations from students, teachers, parents, alumni, and community members.
- `/account` — approved team-only overview, school pipeline, visit/activity history, recommendation inbox, and account approvals.

## Checks

```sh
npm run typecheck
npm run lint
npm run build
```
