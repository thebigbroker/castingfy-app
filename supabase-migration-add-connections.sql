-- ============================================================================
-- MIGRATION: Sistema de conexiones entre usuarios
-- ============================================================================
-- Fecha: 2025-01-19
-- Descripción: Sistema de conexiones/networking estilo LinkedIn
--
-- INSTRUCCIONES:
-- 1. Ir a Supabase Dashboard → SQL Editor
-- 2. Copiar y pegar este archivo
-- 3. Hacer clic en "Run"
-- ============================================================================

-- Crear tabla de conexiones
CREATE TABLE IF NOT EXISTS connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  connected_user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, accepted, rejected
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_connection UNIQUE (user_id, connected_user_id),
  CONSTRAINT different_users_connection CHECK (user_id != connected_user_id)
);

-- Índices para conexiones
CREATE INDEX IF NOT EXISTS idx_connections_user ON connections(user_id);
CREATE INDEX IF NOT EXISTS idx_connections_connected_user ON connections(connected_user_id);
CREATE INDEX IF NOT EXISTS idx_connections_status ON connections(status);
CREATE INDEX IF NOT EXISTS idx_connections_updated_at ON connections(updated_at DESC);

-- Índice compuesto para búsquedas bidireccionales
CREATE INDEX IF NOT EXISTS idx_connections_bidirectional
  ON connections(user_id, connected_user_id, status);

-- Trigger para updated_at en conexiones
CREATE TRIGGER update_connections_updated_at
  BEFORE UPDATE ON connections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS en conexiones
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;

-- Política: Usuarios pueden ver conexiones donde participan
CREATE POLICY "Usuarios pueden ver sus conexiones"
  ON connections FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = connected_user_id);

-- Política: Usuarios pueden crear solicitudes de conexión
CREATE POLICY "Usuarios pueden enviar solicitudes de conexión"
  ON connections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política: Usuarios pueden actualizar conexiones donde son el receptor
CREATE POLICY "Usuarios pueden aceptar/rechazar conexiones"
  ON connections FOR UPDATE
  USING (auth.uid() = connected_user_id);

-- Política: Usuarios pueden eliminar sus propias conexiones
CREATE POLICY "Usuarios pueden eliminar sus conexiones"
  ON connections FOR DELETE
  USING (auth.uid() = user_id OR auth.uid() = connected_user_id);

-- Comentarios
COMMENT ON TABLE connections IS 'Conexiones entre usuarios (networking estilo LinkedIn)';
COMMENT ON COLUMN connections.user_id IS 'Usuario que envía la solicitud de conexión';
COMMENT ON COLUMN connections.connected_user_id IS 'Usuario que recibe la solicitud de conexión';
COMMENT ON COLUMN connections.status IS 'Estado: pending (pendiente), accepted (aceptada), rejected (rechazada)';
