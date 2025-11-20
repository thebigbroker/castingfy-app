-- Añadir campos faltantes a producer_profiles
-- Esta migración agrega los campos que faltan en la tabla producer_profiles

-- Añadir campo credits si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name='producer_profiles'
        AND column_name='credits'
    ) THEN
        ALTER TABLE producer_profiles ADD COLUMN credits TEXT;
        COMMENT ON COLUMN producer_profiles.credits IS 'Créditos y proyectos anteriores del productor';
    END IF;
END $$;

-- Añadir campo bio si no existe (para descripción de la empresa)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name='producer_profiles'
        AND column_name='bio'
    ) THEN
        ALTER TABLE producer_profiles ADD COLUMN bio TEXT;
        COMMENT ON COLUMN producer_profiles.bio IS 'Descripción de la empresa o productora';
    END IF;
END $$;

-- Añadir campo location si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name='producer_profiles'
        AND column_name='location'
    ) THEN
        ALTER TABLE producer_profiles ADD COLUMN location TEXT;
        COMMENT ON COLUMN producer_profiles.location IS 'Ubicación principal de la empresa';
    END IF;
END $$;
