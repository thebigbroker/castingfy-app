-- ============================================================================
-- MIGRATION: Añadir IMDB y sistema de chat
-- ============================================================================
-- Fecha: 2025-01-19
-- Descripción: Añade campo imdb_url a perfiles y crea sistema de mensajería
--
-- INSTRUCCIONES:
-- 1. Ir a Supabase Dashboard → SQL Editor
-- 2. Copiar y pegar este archivo
-- 3. Hacer clic en "Run"
-- ============================================================================

-- Añadir campo imdb_url a talent_profiles
ALTER TABLE talent_profiles
ADD COLUMN IF NOT EXISTS imdb_url TEXT;

-- Añadir campo imdb_url a producer_profiles
ALTER TABLE producer_profiles
ADD COLUMN IF NOT EXISTS imdb_url TEXT;

-- Crear tabla de conversaciones (chats)
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user1_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  user2_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_conversation UNIQUE (user1_id, user2_id),
  CONSTRAINT different_users CHECK (user1_id != user2_id)
);

-- Crear tabla de mensajes
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para conversaciones
CREATE INDEX IF NOT EXISTS idx_conversations_user1 ON conversations(user1_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user2 ON conversations(user2_id);
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON conversations(updated_at DESC);

-- Índices para mensajes
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_unread ON messages(is_read) WHERE is_read = FALSE;

-- Trigger para updated_at en conversaciones
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET updated_at = NOW()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_conversation_on_message
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_timestamp();

-- Habilitar RLS en conversaciones
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Política: Usuarios pueden ver sus propias conversaciones
CREATE POLICY "Usuarios pueden ver sus conversaciones"
  ON conversations FOR SELECT
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Política: Usuarios pueden crear conversaciones donde participan
CREATE POLICY "Usuarios pueden crear conversaciones"
  ON conversations FOR INSERT
  WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Habilitar RLS en mensajes
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Política: Usuarios pueden ver mensajes de sus conversaciones
CREATE POLICY "Usuarios pueden ver mensajes de sus conversaciones"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND (conversations.user1_id = auth.uid() OR conversations.user2_id = auth.uid())
    )
  );

-- Política: Usuarios pueden enviar mensajes en sus conversaciones
CREATE POLICY "Usuarios pueden enviar mensajes"
  ON messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = conversation_id
      AND (conversations.user1_id = auth.uid() OR conversations.user2_id = auth.uid())
    )
  );

-- Política: Usuarios pueden marcar como leídos sus mensajes
CREATE POLICY "Usuarios pueden marcar mensajes como leídos"
  ON messages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND (conversations.user1_id = auth.uid() OR conversations.user2_id = auth.uid())
    )
  );

-- Comentarios
COMMENT ON COLUMN talent_profiles.imdb_url IS 'URL del perfil de IMDB del talento';
COMMENT ON COLUMN producer_profiles.imdb_url IS 'URL del perfil de IMDB del productor';
COMMENT ON TABLE conversations IS 'Conversaciones entre usuarios';
COMMENT ON TABLE messages IS 'Mensajes dentro de las conversaciones';
COMMENT ON COLUMN conversations.user1_id IS 'ID del primer usuario (ordenado alfabéticamente por ID)';
COMMENT ON COLUMN conversations.user2_id IS 'ID del segundo usuario';
COMMENT ON COLUMN messages.is_read IS 'Indica si el mensaje ha sido leído por el receptor';
