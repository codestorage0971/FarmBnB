-- Add payment-related fields to bookings
alter table public.bookings
  add column if not exists stripe_payment_intent_id text,
  add column if not exists payment_method text;


