-- Additive setup for the Nigeria Hack Club outreach workspace.
-- This migration intentionally does not modify or drop legacy tables.

DO $$ BEGIN
  CREATE TYPE outreach_role AS ENUM ('super_admin', 'coordinator', 'volunteer');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE outreach_school_status AS ENUM ('to_research', 'ready_to_visit', 'contacted', 'visited', 'onboarded', 'blocked', 'not_now');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE school_recommendation_status AS ENUM ('new', 'reviewing', 'contacted', 'converted', 'closed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE outreach_activity_kind AS ENUM ('visit', 'call', 'message', 'event', 'follow_up', 'note');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS outreach_users (
  email text PRIMARY KEY,
  name text NOT NULL,
  role outreach_role NOT NULL DEFAULT 'volunteer',
  state text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS outreach_schools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  state text NOT NULL,
  city text NOT NULL,
  school_type text NOT NULL DEFAULT 'secondary',
  status outreach_school_status NOT NULL DEFAULT 'to_research',
  lead_source text NOT NULL DEFAULT 'team research',
  barrier text,
  resource_notes text,
  next_step text,
  next_step_at timestamptz,
  contact_name text,
  contact_email text,
  assigned_email text,
  created_by text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS school_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_name text NOT NULL,
  state text NOT NULL,
  city text NOT NULL,
  school_type text NOT NULL DEFAULT 'secondary',
  recommender_role text NOT NULL,
  contact_name text,
  contact_email text,
  why text NOT NULL,
  wants_visit boolean NOT NULL DEFAULT false,
  consent_to_contact boolean NOT NULL DEFAULT false,
  status school_recommendation_status NOT NULL DEFAULT 'new',
  school_id uuid REFERENCES outreach_schools(id) ON DELETE SET NULL,
  internal_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS outreach_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid REFERENCES outreach_schools(id) ON DELETE CASCADE,
  actor_email text NOT NULL,
  attendees text,
  kind outreach_activity_kind NOT NULL,
  summary text NOT NULL,
  happened_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS outreach_schools_state_status_idx ON outreach_schools(state, status);
CREATE INDEX IF NOT EXISTS outreach_schools_next_step_idx ON outreach_schools(next_step_at);
CREATE INDEX IF NOT EXISTS school_recommendations_status_created_idx ON school_recommendations(status, created_at DESC);
CREATE INDEX IF NOT EXISTS outreach_activities_school_happened_idx ON outreach_activities(school_id, happened_at DESC);
