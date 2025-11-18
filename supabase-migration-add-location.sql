-- ============================================================================
-- MIGRATION: Añadir campos de ubicación a users
-- ============================================================================
-- Fecha: 2025-01-18
-- Descripción: Añade campos country y postal_code a la tabla users
--
-- INSTRUCCIONES:
-- 1. Ir a Supabase Dashboard → SQL Editor
-- 2. Copiar y pegar este archivo
-- 3. Hacer clic en "Run"
-- ============================================================================

-- Añadir columnas country y postal_code a la tabla users
ALTER TABLE users
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS postal_code TEXT;

-- Crear índices para búsquedas por ubicación
CREATE INDEX IF NOT EXISTS idx_users_country ON users(country);
CREATE INDEX IF NOT EXISTS idx_users_postal_code ON users(postal_code);

-- Comentarios para documentación
COMMENT ON COLUMN users.country IS 'Código de país ISO (ej: ES, MX, AR)';
COMMENT ON COLUMN users.postal_code IS 'Código postal del usuario para mostrar castings cercanos';
