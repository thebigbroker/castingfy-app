import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user data from database
  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-text-muted">Bienvenido a Castingfy</p>
          </div>

          <form action="/api/auth/signout" method="post">
            <button
              type="submit"
              className="px-6 py-2 bg-surface border border-border rounded-md hover:bg-surface/80 transition-colors"
            >
              Cerrar sesión
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-surface border border-border rounded-lg">
            <h3 className="text-sm font-medium text-text-muted mb-1">Email</h3>
            <p className="text-lg">{user.email}</p>
          </div>

          <div className="p-6 bg-surface border border-border rounded-lg">
            <h3 className="text-sm font-medium text-text-muted mb-1">Rol</h3>
            <p className="text-lg capitalize">{userData?.role || "No definido"}</p>
          </div>

          <div className="p-6 bg-surface border border-border rounded-lg">
            <h3 className="text-sm font-medium text-text-muted mb-1">Estado</h3>
            <p className="text-lg capitalize">{userData?.status || "Pendiente"}</p>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">Tu perfil</h2>
          <p className="text-text-muted mb-6">
            Completa tu perfil para comenzar a explorar oportunidades en Castingfy.
          </p>

          {userData?.role === "talento" ? (
            <div className="space-y-4">
              <p className="text-sm text-text-muted">
                Como talento, podrás:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-muted">
                <li>Crear y gestionar tu perfil profesional</li>
                <li>Subir tu headshot y video reel</li>
                <li>Explorar castings disponibles</li>
                <li>Aplicar a oportunidades que se ajusten a tu perfil</li>
              </ul>
            </div>
          ) : userData?.role === "productor" ? (
            <div className="space-y-4">
              <p className="text-sm text-text-muted">
                Como productor, podrás:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-muted">
                <li>Publicar castings para tus proyectos</li>
                <li>Buscar y filtrar talento</li>
                <li>Gestionar aplicaciones recibidas</li>
                <li>Contactar directamente con los candidatos</li>
              </ul>
            </div>
          ) : (
            <p className="text-text-muted">
              Por favor, completa tu registro para acceder a todas las funcionalidades.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
