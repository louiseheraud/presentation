create table if not exists rules (
  id          uuid primary key default gen_random_uuid(),
  text        text not null,
  "order"     integer not null default 0,
  created_at  timestamptz default now()
);
