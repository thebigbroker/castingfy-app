-- ============================================================================
-- MIGRATION: Añadir posts e Instagram a perfiles
-- ============================================================================
-- Fecha: 2025-01-18
-- Descripción: Añade columna instagram_url y tabla posts para perfiles sociales
--
-- INSTRUCCIONES:
-- 1. Ir a Supabase Dashboard → SQL Editor
-- 2. Copiar y pegar este archivo
-- 3. Hacer clic en "Run"
-- ============================================================================

-- Añadir campo instagram_url a talent_profiles
ALTER TABLE talent_profiles
ADD COLUMN IF NOT EXISTS instagram_url TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT;

-- Añadir campo instagram_url a producer_profiles
ALTER TABLE producer_profiles
ADD COLUMN IF NOT EXISTS instagram_url TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT;

-- Crear tabla de posts
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para posts
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

-- Trigger para updated_at en posts
CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS en posts
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden ver posts
CREATE POLICY "Posts son públicos"
  ON posts FOR SELECT
  USING (true);

-- Política: Solo el dueño puede crear/editar/eliminar sus posts
CREATE POLICY "Usuarios pueden gestionar sus posts"
  ON posts FOR ALL
  USING (auth.uid() = user_id);

-- Comentarios
COMMENT ON COLUMN talent_profiles.instagram_url IS 'URL del perfil de Instagram del talento';
COMMENT ON COLUMN producer_profiles.instagram_url IS 'URL del perfil de Instagram del productor';
COMMENT ON TABLE posts IS 'Posts internos del usuario en su perfil (estilo Facebook)';
