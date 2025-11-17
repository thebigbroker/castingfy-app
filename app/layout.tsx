import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Castingfy — Tu casting, sin fricción",
  description: "Publica y descubre castings en minutos. La plataforma que conecta talento con oportunidades en España.",
  keywords: ["castings", "actores", "modelos", "productoras", "españa", "talento"],
  authors: [{ name: "Castingfy" }],
  openGraph: {
    title: "Castingfy — Tu casting, sin fricción",
    description: "Publica y descubre castings en minutos",
    type: "website",
    locale: "es_ES",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
