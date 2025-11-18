-- ============================================================================
-- MIGRATION: Auto-verificar todos los usuarios
-- ============================================================================
-- Fecha: 2025-01-18
-- Descripción: Cambia status de 'pending' a 'verified' para todos los usuarios
--
-- RAZÓN: Para el MVP, queremos que todos los usuarios tengan acceso inmediato
-- sin necesidad de aprobación manual de un administrador.
--
-- INSTRUCCIONES:
-- 1. Ir a Supabase Dashboard → SQL Editor
-- 2. Copiar y pegar este archivo
-- 3. Hacer clic en "Run"
-- ============================================================================

-- Actualizar usuarios existentes de pending a verified
UPDATE users
SET status = 'verified',
    updated_at = NOW()
WHERE status = 'pending';

-- Verificar cuántos usuarios se actualizaron
-- (ejecuta esto después para verificar)
SELECT
  status,
  COUNT(*) as total
FROM users
GROUP BY status;

-- ============================================================================
-- RESULTADO ESPERADO:
-- - Todos los usuarios tendrán status = 'verified'
-- - Acceso inmediato a toda la plataforma
-- - Sin necesidad de aprobación manual
-- ============================================================================

-- NOTA: Si en el futuro quieres activar verificación manual,
-- simplemente cambia "verified" por "pending" en el código de registro
