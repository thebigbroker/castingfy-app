# Castingfy App

Plataforma de castings profesional para España. Conecta talento con oportunidades.

## 🚀 Características

- **Autenticación completa**: Email/Password + Google OAuth vía Supabase
- **Perfiles diferenciados**: Talento (actores, modelos) y Productores (agencias, directores)
- **Registro multi-paso**: Formularios intuitivos con validación
- **Dashboard personalizado**: Gestión de perfil y oportunidades
- **Subida de archivos**: Headshots y video reels vía Uploadcare
- **Diseño moderno**: Dark mode con gradientes y animaciones fluidas
- **Responsive**: Optimizado para todos los dispositivos

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 15 con App Router
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Base de datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Almacenamiento**: Uploadcare
- **Validación**: Zod + React Hook Form
- **Estado**: Zustand

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.local.example .env.local
# Editar .env.local con tus credenciales

# Ejecutar en desarrollo
npm run dev

# Compilar para producción
npm run build

# Iniciar en producción
npm start
```

## 🔐 Variables de Entorno

Crear archivo `.env.local` con:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY=tu_uploadcare_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📁 Estructura del Proyecto

```
castingfy-app-clean/
├── app/
│   ├── (auth)/
│   │   ├── login/          # Página de inicio de sesión
│   │   └── registro/       # Página de registro
│   ├── dashboard/          # Dashboard de usuario
│   ├── api/
│   │   └── auth/          # API routes de autenticación
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página de inicio
├── components/
│   ├── ui/                # Componentes UI reutilizables
│   ├── forms/             # Componentes de formularios
│   └── layout/            # Componentes de layout
├── lib/
│   ├── supabase/          # Cliente de Supabase
│   ├── utils/             # Utilidades
│   ├── validations/       # Esquemas de validación
│   └── stores/            # Estado global (Zustand)
├── types/                 # Definiciones de TypeScript
└── public/                # Archivos estáticos
```

## 🔄 Configuración de Supabase

1. Crear proyecto en [Supabase](https://supabase.com)
2. Ejecutar el schema SQL desde `/Users/santiclavijo/Projects/castingfy-landing/supabase-schema-fixed.sql`
3. Configurar Google OAuth en Supabase Auth Settings
4. Copiar URL y Anon Key a `.env.local`

## 📝 Próximas Funcionalidades

- [ ] Completar perfil multi-paso (talento y productor)
- [ ] Sistema de castings (publicar y explorar)
- [ ] Sistema de aplicaciones
- [ ] Chat directo entre talento y productores
- [ ] Búsqueda y filtros avanzados
- [ ] Notificaciones por email
- [ ] Panel de administración

## 🚢 Deployment

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Configurar las variables de entorno en el dashboard de Vercel.

## 📄 Licencia

© 2025 Castingfy. Todos los derechos reservados.
