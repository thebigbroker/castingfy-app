# 🔧 FIX: Error "skills column not in schema cache"

## 📋 PROBLEMA DETECTADO

Al crear un perfil de talento, aparece este error:
```
skills column of talent_profiles no está en el schema cache
```

## 🔍 CAUSA RAÍZ

El código en `app/(auth)/registro/completar-perfil/page.tsx` (línea 101) está intentando insertar:
```typescript
skills: data.skills || null
```

Pero el schema de Supabase tiene:
```sql
special_skills TEXT  -- ❌ Nombre diferente y tipo TEXT en lugar de TEXT[]
```

## ✅ SOLUCIÓN

Ejecutar la migración SQL para añadir la columna `skills` correcta.

---

## 🚀 PASOS PARA ARREGLAR

### **1. Ir a Supabase Dashboard**

1. Abre https://supabase.com/dashboard
2. Selecciona el proyecto **Castingfy**
3. Ve a **SQL Editor** (en el menú lateral)

### **2. Ejecutar la migración**

1. Copia el contenido del archivo: `supabase-migration-add-skills-column.sql`
2. Pégalo en el SQL Editor
3. Haz clic en **"Run"**

### **3. Verificar que funcionó**

1. Ve a **Table Editor** → **talent_profiles**
2. Verifica que existe la columna `skills` con tipo `text[]`
3. Debe aparecer en la lista de columnas

---

## 📝 CONTENIDO DE LA MIGRACIÓN

```sql
-- Añadir columna skills como array de texto
ALTER TABLE talent_profiles
ADD COLUMN IF NOT EXISTS skills TEXT[];

-- Crear índice para búsquedas eficientes
CREATE INDEX IF NOT EXISTS idx_talent_skills
ON talent_profiles USING GIN(skills);
```

---

## ✅ DESPUÉS DE EJECUTAR

Una vez ejecutada la migración en Supabase:

1. ✅ Los usuarios podrán crear perfiles sin error
2. ✅ La columna `skills` aceptará arrays de texto: `["Canto", "Baile", "Acrobacia"]`
3. ✅ Las búsquedas por skills serán eficientes gracias al índice GIN

---

## 🔄 PRÓXIMOS PASOS (OPCIONAL)

Si quieres limpiar el schema:

### Opción A: Eliminar `special_skills` antigua
```sql
ALTER TABLE talent_profiles DROP COLUMN IF EXISTS special_skills;
```

### Opción B: Migrar datos de `special_skills` a `skills`
```sql
-- Convertir special_skills (TEXT) en array
UPDATE talent_profiles
SET skills = string_to_array(special_skills, ',')
WHERE special_skills IS NOT NULL AND skills IS NULL;
```

---

## 📊 VERIFICACIÓN

Para verificar que todo funciona:

```sql
-- Ver estructura de la tabla
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'talent_profiles'
AND column_name IN ('skills', 'special_skills');

-- Debe mostrar:
-- skills      | ARRAY      | YES
-- special_skills | text    | YES (si no la eliminaste)
```

---

## 🐛 SI EL ERROR PERSISTE

1. **Verificar que la migración se ejecutó**:
   - Revisa en Table Editor que la columna existe

2. **Limpiar caché de Supabase**:
   - En Dashboard → Settings → API → Refresh Schema Cache

3. **Reiniciar la app**:
   - En Vercel: Settings → Deployments → Redeploy

4. **Verificar variables de entorno**:
   - Asegúrate que `NEXT_PUBLIC_SUPABASE_URL` es correcta

---

## ✅ ESTADO DESPUÉS DEL FIX

- ✅ Columna `skills` creada como `TEXT[]`
- ✅ Índice GIN para búsquedas eficientes
- ✅ Formulario de perfil funcionará correctamente
- ✅ Sin errores al crear perfiles de talento

---

**Fecha:** 2025-01-18
**Versión:** 1.0
