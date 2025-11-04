-- Create table to store admin-defined blackout dates per property
create table if not exists public.property_blackouts (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references public.properties(id) on delete cascade not null,
  date date not null,
  reason text,
  created_at timestamptz default now(),
  unique(property_id, date)
);


