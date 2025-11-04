-- Add manual_reference column to store offline payment reference IDs
alter table public.bookings
  add column if not exists manual_reference text;


