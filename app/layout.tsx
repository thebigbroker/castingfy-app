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
  title: "CASTINGFY — Professional Casting Platform",
  description: "Connect with thousands of professional actors, models, and talent. Streamline your casting process with CASTINGFY.",
  keywords: ["casting", "actors", "models", "talent", "producers", "auditions", "professional casting"],
  authors: [{ name: "CASTINGFY" }],
  openGraph: {
    title: "CASTINGFY — Professional Casting Platform",
    description: "Connect talent with opportunities. Professional casting made simple.",
    type: "website",
    locale: "en_US",
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
