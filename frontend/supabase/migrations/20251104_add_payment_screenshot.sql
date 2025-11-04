-- Add payment screenshot URL to bookings
alter table public.bookings
  add column if not exists payment_screenshot_url text;

