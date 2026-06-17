import type { Metadata } from "next";
import { Inter, Marcellus } from "next/font/google";
import "./globals.css";

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
  title: "Alexandria.ia — API de Tokens Infinitos",
  description: "API de inteligência artificial com tokens infinitos. Sem limites de consumo, sem surpresas no faturamento.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23c9a55a%22 stroke-width=%222%22><path d=%22M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6%22/></svg>",
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
        <div className="blueprint-grid" />
        {children}
      </body>
    </html>
  );
}
