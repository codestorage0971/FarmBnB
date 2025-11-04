-- Add Google Maps URL to properties
alter table public.properties
  add column if not exists google_maps_url text;


