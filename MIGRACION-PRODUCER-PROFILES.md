# Migración de Producer Profiles

## Problema
La tabla `producer_profiles` en Supabase no tiene las columnas `credits`, `bio`, y `location` que el código está intentando usar.

## Solución
Ejecutar la migración SQL que agrega estas columnas.

## Pasos para ejecutar la migración

### Opción 1: Desde Supabase Dashboard (Recomendado)

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Navega a **SQL Editor** en el menú lateral
3. Copia el contenido del archivo `supabase-migration-add-producer-fields.sql`
4. Pégalo en el editor SQL
5. Haz clic en **Run** para ejecutar la migración

### Opción 2: Desde la CLI de Supabase

```bash
# Si tienes Supabase CLI instalado
supabase db push

# O ejecuta el archivo directamente
psql -h <your-project-ref>.supabase.co -U postgres -d postgres -f supabase-migration-add-producer-fields.sql
```

## Qué hace esta migración

Agrega las siguientes columnas a la tabla `producer_profiles`:

1. **credits** (TEXT): Créditos y proyectos anteriores del productor
2. **bio** (TEXT): Descripción de la empresa o productora
3. **location** (TEXT): Ubicación principal de la empresa

La migración usa `DO $$ ... END $$` para verificar si las columnas ya existen antes de agregarlas, así es seguro ejecutarla múltiples veces.

## Verificación

Después de ejecutar la migración, verifica que las columnas se crearon correctamente:

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'producer_profiles';
```

## Después de la migración

Una vez ejecutada la migración, el registro de productores funcionará correctamente y podrás guardar:
- Nombre de la empresa ✅
- Website ✅
- Créditos/proyectos anteriores ✅
- Descripción de la empresa (bio) ✅
- Ubicación ✅
