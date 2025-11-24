-- =============================================================================
-- CUENTAS DE PRUEBA PARA CASTINGFY
-- =============================================================================
-- Este script crea dos cuentas de prueba:
-- 1. Talento: talento@castingfy.test / Castingfy2025!
-- 2. Productor: productor@castingfy.test / Castingfy2025!
--
-- IMPORTANTE: Ejecuta este script en Supabase SQL Editor
-- =============================================================================

-- Variables para los UUIDs (genera nuevos UUIDs)
DO $$
DECLARE
  talent_uuid UUID := gen_random_uuid();
  producer_uuid UUID := gen_random_uuid();
  talent_email TEXT := 'talento@castingfy.test';
  producer_email TEXT := 'productor@castingfy.test';
  hashed_password TEXT := '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'; -- Castingfy2025!
BEGIN

  -- =============================================================================
  -- 1. CREAR USUARIOS EN auth.users (tabla de autenticación de Supabase)
  -- =============================================================================

  -- Usuario Talento
  INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    invited_at,
    confirmation_token,
    confirmation_sent_at,
    recovery_token,
    recovery_sent_at,
    email_change_token_new,
    email_change,
    email_change_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    phone,
    phone_confirmed_at,
    phone_change,
    phone_change_token,
    phone_change_sent_at,
    email_change_token_current,
    email_change_confirm_status,
    banned_until,
    reauthentication_token,
    reauthentication_sent_at,
    is_sso_user,
    deleted_at
  ) VALUES (
    talent_uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    talent_email,
    hashed_password,
    NOW(),
    NULL,
    '',
    NULL,
    '',
    NULL,
    '',
    '',
    NULL,
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    FALSE,
    NOW(),
    NOW(),
    NULL,
    NULL,
    '',
    '',
    NULL,
    '',
    0,
    NULL,
    '',
    NULL,
    FALSE,
    NULL
  )
  ON CONFLICT (id) DO NOTHING;

  -- Usuario Productor
  INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    invited_at,
    confirmation_token,
    confirmation_sent_at,
    recovery_token,
    recovery_sent_at,
    email_change_token_new,
    email_change,
    email_change_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    phone,
    phone_confirmed_at,
    phone_change,
    phone_change_token,
    phone_change_sent_at,
    email_change_token_current,
    email_change_confirm_status,
    banned_until,
    reauthentication_token,
    reauthentication_sent_at,
    is_sso_user,
    deleted_at
  ) VALUES (
    producer_uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    producer_email,
    hashed_password,
    NOW(),
    NULL,
    '',
    NULL,
    '',
    NULL,
    '',
    '',
    NULL,
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    FALSE,
    NOW(),
    NOW(),
    NULL,
    NULL,
    '',
    '',
    NULL,
    '',
    0,
    NULL,
    '',
    NULL,
    FALSE,
    NULL
  )
  ON CONFLICT (id) DO NOTHING;

  -- =============================================================================
  -- 2. CREAR REGISTROS EN public.users
  -- =============================================================================

  -- Usuario Talento
  INSERT INTO public.users (id, email, role, status, created_at, updated_at)
  VALUES (
    talent_uuid,
    talent_email,
    'talento',
    'verified',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;

  -- Usuario Productor
  INSERT INTO public.users (id, email, role, status, created_at, updated_at)
  VALUES (
    producer_uuid,
    producer_email,
    'productor',
    'verified',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;

  -- =============================================================================
  -- 3. CREAR PERFILES
  -- =============================================================================

  -- Perfil de Talento
  INSERT INTO public.talent_profiles (
    user_id,
    stage_name,
    bio,
    location,
    age,
    gender,
    height,
    languages,
    skills,
    instagram_url,
    imdb_url,
    headshot_url,
    cover_image_url,
    average_rating,
    total_reviews,
    created_at,
    updated_at
  ) VALUES (
    talent_uuid,
    'Andrea Lizarte',
    'Actriz profesional con más de 5 años de experiencia en teatro y cine. Especializada en drama contemporáneo y comedia. He trabajado en producciones nacionales e internacionales, incluyendo cortometrajes premiados y obras de teatro en Madrid.',
    'Madrid, España',
    28,
    'Mujer',
    165,
    ARRAY['Español', 'Inglés', 'Francés'],
    ARRAY['Actuación', 'Teatro', 'Improvisación', 'Danza', 'Canto'],
    'https://instagram.com/andrealizarte',
    'https://www.imdb.com/name/nm0000000/',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=1920&h=480&fit=crop',
    0,
    0,
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id) DO NOTHING;

  -- Perfil de Productor
  INSERT INTO public.producer_profiles (
    user_id,
    company_name,
    bio,
    location,
    project_types,
    website,
    instagram,
    credits,
    created_at,
    updated_at
  ) VALUES (
    producer_uuid,
    'Luna Productions',
    'Productora audiovisual especializada en cortometrajes, publicidad y contenido digital. Con más de 10 años de experiencia en la industria, hemos producido más de 50 proyectos para marcas reconocidas y artistas emergentes.',
    'Barcelona, España',
    ARRAY['Cortometraje', 'Publicidad', 'Videoclip', 'Contenido Digital'],
    'https://lunaproductions.es',
    '@lunaproductions',
    'Proyectos destacados: "El Último Café" (2023), "Sombras Urbanas" (2022), Campaña Coca-Cola España (2021)',
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id) DO NOTHING;

  -- =============================================================================
  -- 4. CREAR UN PROYECTO DE EJEMPLO PARA EL PRODUCTOR
  -- =============================================================================

  INSERT INTO public.projects (
    user_id,
    title,
    description,
    project_type,
    status,
    budget_range,
    location,
    start_date,
    end_date,
    roles,
    compensation,
    created_at,
    updated_at
  ) VALUES (
    producer_uuid,
    'Cortometraje "Voces del Silencio"',
    'Buscamos talentos para nuestro nuevo cortometraje dramático sobre la importancia de la salud mental. Historia íntima y emotiva ambientada en Barcelona. Rodaje de 5 días con equipo profesional completo.',
    'Cortometraje',
    'published',
    '€5,000 - €10,000',
    'Barcelona, España',
    CURRENT_DATE + INTERVAL '30 days',
    CURRENT_DATE + INTERVAL '60 days',
    jsonb_build_array(
      jsonb_build_object(
        'name', 'Protagonista Femenina',
        'category', 'Actores',
        'gender', 'Mujer',
        'ageRange', '25-35',
        'description', 'Protagonista principal. Mujer en sus 30s lidiando con ansiedad y depresión. Requiere gran capacidad dramática y sensibilidad.'
      ),
      jsonb_build_object(
        'name', 'Protagonista Masculino',
        'category', 'Actores',
        'gender', 'Hombre',
        'ageRange', '30-40',
        'description', 'Psicólogo y amigo de la protagonista. Personaje de apoyo con presencia constante en la historia.'
      ),
      jsonb_build_object(
        'name', 'Madre',
        'category', 'Actores',
        'gender', 'Mujer',
        'ageRange', '50-65',
        'description', 'Madre de la protagonista. Escenas familiares cargadas emocionalmente.'
      )
    ),
    jsonb_build_object(
      'type', 'paid',
      'amount', '€500 por día de rodaje',
      'details', 'Incluye dietas y transporte'
    ),
    NOW(),
    NOW()
  );

  -- =============================================================================
  -- RESUMEN
  -- =============================================================================

  RAISE NOTICE '✅ Cuentas de prueba creadas exitosamente!';
  RAISE NOTICE '';
  RAISE NOTICE '👤 CUENTA TALENTO:';
  RAISE NOTICE '   Email: %', talent_email;
  RAISE NOTICE '   Password: Castingfy2025!';
  RAISE NOTICE '   Nombre: Andrea Lizarte';
  RAISE NOTICE '   UUID: %', talent_uuid;
  RAISE NOTICE '';
  RAISE NOTICE '🎬 CUENTA PRODUCTOR:';
  RAISE NOTICE '   Email: %', producer_email;
  RAISE NOTICE '   Password: Castingfy2025!';
  RAISE NOTICE '   Empresa: Luna Productions';
  RAISE NOTICE '   UUID: %', producer_uuid;
  RAISE NOTICE '';
  RAISE NOTICE '📋 Se ha creado 1 proyecto de ejemplo (publicado)';
  RAISE NOTICE '';
  RAISE NOTICE 'Puedes iniciar sesión en: https://app.castingfy.com/login';

END $$;
