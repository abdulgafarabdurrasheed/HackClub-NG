-- Add password accounts and an approval queue for the outreach workspace.
-- Existing team rows remain approved and keep their current roles.

DO $$ BEGIN
  CREATE TYPE outreach_account_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE outreach_users
  ADD COLUMN IF NOT EXISTS username text,
  ADD COLUMN IF NOT EXISTS password_hash text,
  ADD COLUMN IF NOT EXISTS approval_status outreach_account_status NOT NULL DEFAULT 'approved',
  ADD COLUMN IF NOT EXISTS reviewed_by text,
  ADD COLUMN IF NOT EXISTS reviewed_at timestamptz;

CREATE UNIQUE INDEX IF NOT EXISTS outreach_users_username_unique_idx
  ON outreach_users(username);

CREATE INDEX IF NOT EXISTS outreach_users_approval_status_idx
  ON outreach_users(approval_status, created_at);
