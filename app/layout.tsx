import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

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
    <html lang="es" className={inter.variable}>
      <head>
        <link
          rel="stylesheet"
          href="https://ucarecdn.com/libs/widget/3.x/uploadcare.min.css"
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
