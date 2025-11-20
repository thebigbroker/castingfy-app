-- Añadir campo instagram a producer_profiles
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name='producer_profiles'
        AND column_name='instagram'
    ) THEN
        ALTER TABLE producer_profiles ADD COLUMN instagram TEXT;
        COMMENT ON COLUMN producer_profiles.instagram IS 'Usuario o URL de Instagram del productor';
    END IF;
END $$;
