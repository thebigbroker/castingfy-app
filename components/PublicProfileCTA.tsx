"use client";

import { useRouter } from "next/navigation";

interface PublicProfileCTAProps {
  profileType: "talent" | "producer";
}

export default function PublicProfileCTA({ profileType }: PublicProfileCTAProps) {
  const router = useRouter();

  const ctaMessage = profileType === "talent"
    ? "¿Quieres contactar con este talento?"
    : "¿Quieres ver los proyectos de este productor?";

  const benefits = profileType === "talent"
    ? [
        "Envía mensajes directos",
        "Guarda en favoritos",
        "Ve información de contacto completa",
        "Accede a su portafolio completo",
      ]
    : [
        "Ve todos sus proyectos activos",
        "Aplica a castings abiertos",
        "Envía mensajes directos",
        "Guarda en favoritos",
      ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl">
        {/* Icon */}
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-center mb-3 text-black">
          {ctaMessage}
        </h2>

        <p className="text-center text-gray-600 mb-6">
          Regístrate gratis en Castingfy para acceder a todas las funcionalidades
        </p>

        {/* Benefits */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="font-semibold text-sm mb-3 text-gray-700">
            Con una cuenta gratuita podrás:
          </p>
          <ul className="space-y-2">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <svg
                  className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-700">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => router.push("/registro")}
            className="w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-all font-semibold"
          >
            Crear cuenta gratis
          </button>
          <button
            onClick={() => router.push("/login")}
            className="w-full px-6 py-3 bg-white text-black border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-all font-semibold"
          >
            Ya tengo cuenta
          </button>
        </div>

        {/* Footer note */}
        <p className="text-xs text-center text-gray-500 mt-6">
          🎬 Únete a la comunidad de casting más grande de habla hispana
        </p>
      </div>
    </div>
  );
}
