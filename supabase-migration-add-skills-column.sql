-- ============================================================================
-- MIGRATION: Añadir columna skills a talent_profiles
-- ============================================================================
-- Fecha: 2025-01-18
-- Descripción: Añade columna skills como array de texto para almacenar habilidades
--
-- PROBLEMA: El código usa "skills" pero el schema tiene "special_skills" como TEXT
-- SOLUCIÓN: Añadir columna "skills" como TEXT[] (array)
--
-- INSTRUCCIONES:
-- 1. Ir a Supabase Dashboard → SQL Editor
-- 2. Copiar y pegar este archivo
-- 3. Hacer clic en "Run"
-- ============================================================================

-- Añadir columna skills como array de texto
ALTER TABLE talent_profiles
ADD COLUMN IF NOT EXISTS skills TEXT[];

-- Crear índice GIN para búsquedas eficientes en el array
CREATE INDEX IF NOT EXISTS idx_talent_skills ON talent_profiles USING GIN(skills);

-- Comentario para documentación
COMMENT ON COLUMN talent_profiles.skills IS 'Array de habilidades especiales (ej: ["Canto", "Baile", "Acrobacia", "Conducción"])';

-- ============================================================================
-- NOTA: La columna "special_skills" (TEXT) se mantiene por compatibilidad
-- Puedes decidir si migrar datos de special_skills a skills o eliminarla
-- ============================================================================
