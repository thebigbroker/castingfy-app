-- Script simplificado para crear perfiles de talento de prueba
-- Ejecutar en Supabase SQL Editor

-- Función helper para crear talentos de prueba
CREATE OR REPLACE FUNCTION create_demo_talent(
  p_email text,
  p_stage_name text,
  p_location text,
  p_age integer,
  p_gender text,
  p_height integer,
  p_bio text,
  p_headshot_url text,
  p_languages text[],
  p_skills text[]
) RETURNS text AS $$
DECLARE
  v_user_id uuid;
  v_existing_user_id uuid;
BEGIN
  -- Verificar si el email ya existe
  SELECT id INTO v_existing_user_id
  FROM auth.users
  WHERE email = p_email;

  IF v_existing_user_id IS NOT NULL THEN
    -- Usuario ya existe, actualizar solo el perfil
    DELETE FROM talent_profiles WHERE user_id = v_existing_user_id;

    INSERT INTO talent_profiles (
      user_id, stage_name, location, age, gender, height, bio,
      headshot_url, languages, skills
    ) VALUES (
      v_existing_user_id, p_stage_name, p_location, p_age, p_gender,
      p_height, p_bio, p_headshot_url, p_languages, p_skills
    );

    RETURN 'Updated: ' || p_email;
  ELSE
    -- Crear nuevo usuario
    v_user_id := gen_random_uuid();

    -- Insertar en auth.users
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      role,
      aud,
      confirmation_token,
      recovery_token,
      last_sign_in_at
    ) VALUES (
      v_user_id,
      '00000000-0000-0000-0000-000000000000',
      p_email,
      crypt('CastingfyDemo2025!', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      'authenticated',
      'authenticated',
      '',
      '',
      NOW()
    );

    -- Insertar en users
    INSERT INTO users (id, email, role, status)
    VALUES (v_user_id, p_email, 'talento', 'verified');

    -- Insertar perfil de talento
    INSERT INTO talent_profiles (
      user_id, stage_name, location, age, gender, height, bio,
      headshot_url, languages, skills
    ) VALUES (
      v_user_id, p_stage_name, p_location, p_age, p_gender,
      p_height, p_bio, p_headshot_url, p_languages, p_skills
    );

    RETURN 'Created: ' || p_email;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Crear todos los talentos
SELECT create_demo_talent(
  'maria.garcia@example.com',
  'María García',
  'Madrid, España',
  28,
  'Female',
  168,
  'Actriz profesional con 5 años de experiencia en teatro y cine',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&q=80',
  ARRAY['Español', 'Inglés'],
  ARRAY['Actuación', 'Danza', 'Canto']
);

SELECT create_demo_talent(
  'carlos.rodriguez@example.com',
  'Carlos Rodríguez',
  'Barcelona, España',
  32,
  'Male',
  180,
  'Actor de cine y televisión, especializado en drama',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80',
  ARRAY['Español', 'Catalán', 'Inglés'],
  ARRAY['Actuación', 'Artes marciales']
);

SELECT create_demo_talent(
  'lucia.martin@example.com',
  'Lucía Martín',
  'Valencia, España',
  25,
  'Female',
  165,
  'Modelo y actriz emergente con pasión por el arte dramático',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&q=80',
  ARRAY['Español', 'Francés'],
  ARRAY['Modelaje', 'Actuación', 'Ballet']
);

SELECT create_demo_talent(
  'javier.lopez@example.com',
  'Javier López',
  'Sevilla, España',
  35,
  'Male',
  175,
  'Actor de teatro con más de 10 años de trayectoria',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&q=80',
  ARRAY['Español', 'Inglés'],
  ARRAY['Actuación', 'Improvisación', 'Dirección']
);

SELECT create_demo_talent(
  'ana.fernandez@example.com',
  'Ana Fernández',
  'Bilbao, España',
  29,
  'Female',
  170,
  'Actriz de doblaje y teatro musical',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&q=80',
  ARRAY['Español', 'Euskera', 'Inglés'],
  ARRAY['Doblaje', 'Canto', 'Teatro musical']
);

SELECT create_demo_talent(
  'miguel.sanchez@example.com',
  'Miguel Sánchez',
  'Madrid, España',
  40,
  'Male',
  182,
  'Actor veterano con experiencia en cine, teatro y televisión',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&q=80',
  ARRAY['Español', 'Inglés', 'Italiano'],
  ARRAY['Actuación', 'Dirección', 'Escritura']
);

SELECT create_demo_talent(
  'carmen.ruiz@example.com',
  'Carmen Ruiz',
  'Granada, España',
  26,
  'Female',
  162,
  'Bailaora flamenca y actriz de teatro',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&q=80',
  ARRAY['Español'],
  ARRAY['Flamenco', 'Actuación', 'Danza contemporánea']
);

SELECT create_demo_talent(
  'david.torres@example.com',
  'David Torres',
  'Zaragoza, España',
  31,
  'Male',
  178,
  'Actor de cine independiente y cortometrajes',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&q=80',
  ARRAY['Español', 'Inglés'],
  ARRAY['Actuación', 'Producción', 'Edición']
);

SELECT create_demo_talent(
  'elena.jimenez@example.com',
  'Elena Jiménez',
  'Málaga, España',
  27,
  'Female',
  166,
  'Actriz de teatro y modelo publicitaria',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&q=80',
  ARRAY['Español', 'Inglés'],
  ARRAY['Actuación', 'Modelaje', 'Fotografía']
);

-- Limpiar función
DROP FUNCTION create_demo_talent;

-- Verificar resultados
SELECT
  tp.stage_name,
  tp.location,
  LENGTH(tp.headshot_url) as has_headshot,
  u.email
FROM talent_profiles tp
JOIN users u ON u.id = tp.user_id
WHERE u.email LIKE '%@example.com'
ORDER BY tp.created_at DESC;
