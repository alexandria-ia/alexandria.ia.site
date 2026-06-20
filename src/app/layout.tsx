import type { Metadata } from "next";
import { Inter, Marcellus } from "next/font/google";
import "./globals.css";
import ShaderBackground from "@/components/layout/ShaderBackground";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const marcellus = Marcellus({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-marcellus",
});

export const metadata: Metadata = {
  title: "alexandria-tech — API de Tokens Infinitos",
  description: "API de inteligência artificial com tokens infinitos. Sem limites de consumo, sem surpresas no faturamento.",
  icons: {
    icon: "/icons/fav.icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${marcellus.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans text-text-primary bg-bg-deep selection:bg-accent/20 selection:text-accent">
        <ShaderBackground />
        {children}
      </body>
    </html>
  );
}
