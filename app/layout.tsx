import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 🏆 CORRECCIÓN: Metadata oficial de EL CALAMAR
export const metadata: Metadata = {
  title: "El Calamar Mundialista | 2026",
  description: "Centro de Mando y Predicciones del Mundial 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      {/* 🛡️ Escudo activado contra extensiones del navegador */}
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}