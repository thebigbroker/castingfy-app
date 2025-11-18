-- ============================================================================
-- MIGRATION: Sincronizar auth.users con tabla users
-- ============================================================================
-- Fecha: 2025-01-18
-- Descripción: Inserta usuarios faltantes de auth.users en tabla users
--
-- PROBLEMA: Algunos usuarios existen en auth.users pero no en users
-- Esto causa error de foreign key al crear talent_profiles
--
-- INSTRUCCIONES:
-- 1. Ir a Supabase Dashboard → SQL Editor
-- 2. Copiar y pegar este archivo
-- 3. Hacer clic en "Run"
-- ============================================================================

-- Insertar usuarios de auth.users que no existen en users
INSERT INTO users (id, email, role, status, created_at)
SELECT
  au.id,
  au.email,
  'talento' AS role,  -- Default role
  'pending' AS status,
  au.created_at
FROM auth.users au
LEFT JOIN users u ON au.id = u.id
WHERE u.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Verificar cuántos usuarios se sincronizaron
-- (ejecuta esto después de la migración para verificar)
-- SELECT COUNT(*) as usuarios_sincronizados
-- FROM users
-- WHERE created_at >= NOW() - INTERVAL '1 minute';

-- ============================================================================
-- RESULTADO ESPERADO:
-- - Todos los usuarios de auth.users ahora existen en users
-- - Los perfiles de talento se podrán crear sin errores de foreign key
-- ============================================================================
