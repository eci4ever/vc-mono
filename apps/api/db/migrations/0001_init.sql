CREATE TABLE IF NOT EXISTS messages (
  id         bigserial PRIMARY KEY,
  content    text        NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
