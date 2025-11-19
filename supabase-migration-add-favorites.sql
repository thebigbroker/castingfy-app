-- ============================================================================
-- MIGRATION: Sistema de favoritos
-- ============================================================================
-- Fecha: 2025-01-19
-- Descripción: Sistema para marcar usuarios como favoritos
--
-- INSTRUCCIONES:
-- 1. Ir a Supabase Dashboard → SQL Editor
-- 2. Copiar y pegar este archivo
-- 3. Hacer clic en "Run"
-- ============================================================================

-- Crear tabla de favoritos
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  favorited_user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_favorite UNIQUE (user_id, favorited_user_id),
  CONSTRAINT different_users_favorite CHECK (user_id != favorited_user_id)
);

-- Índices para favoritos
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_favorited_user ON favorites(favorited_user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_created_at ON favorites(created_at DESC);

-- Habilitar RLS en favoritos
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Política: Usuarios pueden ver sus propios favoritos
CREATE POLICY "Usuarios pueden ver sus favoritos"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

-- Política: Usuarios pueden agregar favoritos
CREATE POLICY "Usuarios pueden agregar favoritos"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política: Usuarios pueden eliminar sus favoritos
CREATE POLICY "Usuarios pueden eliminar sus favoritos"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Comentarios
COMMENT ON TABLE favorites IS 'Usuarios marcados como favoritos';
COMMENT ON COLUMN favorites.user_id IS 'Usuario que marca como favorito';
COMMENT ON COLUMN favorites.favorited_user_id IS 'Usuario marcado como favorito';
