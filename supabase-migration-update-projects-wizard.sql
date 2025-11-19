-- ============================================================================
-- MIGRATION: Actualización de proyectos para soportar wizard completo
-- ============================================================================
-- Fecha: 2025-01-19
-- Descripción: Añade campos JSON para almacenar toda la información del wizard
--
-- INSTRUCCIONES:
-- 1. Ir a Supabase Dashboard → SQL Editor
-- 2. Copiar y pegar este archivo
-- 3. Hacer clic en "Run"
-- ============================================================================

-- Añadir nuevos campos a la tabla projects
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS union_status VARCHAR(20),
  ADD COLUMN IF NOT EXISTS dates_and_locations TEXT,
  ADD COLUMN IF NOT EXISTS hire_from VARCHAR(100),
  ADD COLUMN IF NOT EXISTS has_special_instructions BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS special_instructions TEXT,
  ADD COLUMN IF NOT EXISTS materials JSONB DEFAULT '{"media": [], "texts": []}'::jsonb,
  ADD COLUMN IF NOT EXISTS roles JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS compensation JSONB DEFAULT '{"byRole": {}}'::jsonb,
  ADD COLUMN IF NOT EXISTS prescreens JSONB DEFAULT '{"questions": [], "mediaRequirements": [], "auditionInstructions": ""}'::jsonb,
  ADD COLUMN IF NOT EXISTS meta JSONB DEFAULT '{}'::jsonb;

-- Comentarios para nuevos campos
COMMENT ON COLUMN projects.union_status IS 'Estado sindical: both, union, non-union, na';
COMMENT ON COLUMN projects.dates_and_locations IS 'Fechas clave y ubicaciones del proyecto';
COMMENT ON COLUMN projects.hire_from IS 'Tipo de ubicación desde donde contratar';
COMMENT ON COLUMN projects.has_special_instructions IS 'Si tiene instrucciones especiales de envío';
COMMENT ON COLUMN projects.special_instructions IS 'Instrucciones especiales para submissions';
COMMENT ON COLUMN projects.materials IS 'Materiales adicionales (JSON): {media: [], texts: []}';
COMMENT ON COLUMN projects.roles IS 'Roles del proyecto (JSON array)';
COMMENT ON COLUMN projects.compensation IS 'Compensación por rol (JSON): {byRole: {roleId: {rateType, amount, currency, notes}}}';
COMMENT ON COLUMN projects.prescreens IS 'Pre-screens y audiciones (JSON): {questions: [], mediaRequirements: [], auditionInstructions: ""}';
COMMENT ON COLUMN projects.meta IS 'Metadata adicional del proyecto';
