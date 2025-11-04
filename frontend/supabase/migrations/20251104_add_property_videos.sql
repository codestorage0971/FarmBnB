-- Add videos array (URLs) to properties
alter table public.properties
  add column if not exists videos TEXT[] DEFAULT '{}'::text[];


