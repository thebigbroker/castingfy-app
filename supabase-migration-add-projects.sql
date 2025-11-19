-- ============================================================================
-- MIGRATION: Sistema de gestión de proyectos/producciones
-- ============================================================================
-- Fecha: 2025-01-19
-- Descripción: Sistema para crear y gestionar proyectos de casting
--
-- INSTRUCCIONES:
-- 1. Ir a Supabase Dashboard → SQL Editor
-- 2. Copiar y pegar este archivo
-- 3. Hacer clic en "Run"
-- ============================================================================

-- Crear tabla de proyectos
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  project_type VARCHAR(50), -- film, series, commercial, theater, etc.
  status VARCHAR(20) NOT NULL DEFAULT 'draft', -- draft, active, casting, production, completed, archived
  budget_range VARCHAR(50), -- low, medium, high, or specific range
  start_date DATE,
  end_date DATE,
  location VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para proyectos
CREATE INDEX IF NOT EXISTS idx_projects_user ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_type ON projects(project_type);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

-- Trigger para updated_at en proyectos
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS en proyectos
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Política: Usuarios pueden ver sus propios proyectos
CREATE POLICY "Usuarios pueden ver sus proyectos"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

-- Política: Usuarios pueden crear proyectos
CREATE POLICY "Usuarios pueden crear proyectos"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política: Usuarios pueden actualizar sus propios proyectos
CREATE POLICY "Usuarios pueden actualizar sus proyectos"
  ON projects FOR UPDATE
  USING (auth.uid() = user_id);

-- Política: Usuarios pueden eliminar sus propios proyectos
CREATE POLICY "Usuarios pueden eliminar sus proyectos"
  ON projects FOR DELETE
  USING (auth.uid() = user_id);

-- Comentarios
COMMENT ON TABLE projects IS 'Proyectos/Producciones creados por usuarios productores';
COMMENT ON COLUMN projects.user_id IS 'Usuario propietario del proyecto (normalmente un productor)';
COMMENT ON COLUMN projects.project_type IS 'Tipo de proyecto: film, series, commercial, theater, etc.';
COMMENT ON COLUMN projects.status IS 'Estado del proyecto: draft, active, casting, production, completed, archived';
COMMENT ON COLUMN projects.budget_range IS 'Rango de presupuesto del proyecto';
