-- Change bookings.customer_id from UUID to TEXT to support Firebase UIDs
do $$
begin
  -- Drop FK if it exists (name may vary, try common name)
  begin
    alter table public.bookings drop constraint if exists bookings_customer_id_fkey;
  exception when others then null;
  end;
end $$;

alter table public.bookings
  alter column customer_id type text using customer_id::text;


