-- Add optional fields to bookings for food preferences and notes
alter table public.bookings
  add column if not exists food_required boolean default false,
  add column if not exists food_preference text check (food_preference in ('veg','non-veg','both') ),
  add column if not exists allergies text,
  add column if not exists special_requests text;


