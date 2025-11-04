-- Add ID proof fields to bookings
alter table public.bookings
  add column if not exists id_proofs text[] default '{}'::text[],
  add column if not exists verification_status text default 'pending' check (verification_status in ('pending','approved','rejected'));


