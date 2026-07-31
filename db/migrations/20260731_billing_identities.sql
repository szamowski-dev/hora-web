CREATE TABLE IF NOT EXISTS billing_identities (
  issuer TEXT NOT NULL,
  google_subject TEXT NOT NULL,
  app_user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (issuer, google_subject),
  UNIQUE (app_user_id),
  CONSTRAINT billing_identities_app_user_id_format
    CHECK (app_user_id ~ '^usr_[A-Za-z0-9_-]{32,}$')
);
