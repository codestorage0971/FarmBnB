-- Add phone_verified column to profiles table (safe if table doesn't exist yet)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    ALTER TABLE public.profiles
      ADD COLUMN IF NOT EXISTS phone_verified boolean DEFAULT false;
  END IF;
END $$;
