import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Teste técnico | Delfos",
  description: "Página de login e registro.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <head>
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
      </head>
      <body className={montserrat.className}>
        <img
          src="backdrop.jpg"
          className="h-screen w-screen bg-gradient absolute pointer-events-none"
          alt=""
        />
        {children}
      </body>
    </html>
  );
}
