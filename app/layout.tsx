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
      <head>
        <link
          rel="stylesheet"
          href="https://ucarecdn.com/libs/widget/3.x/uploadcare.min.css"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
