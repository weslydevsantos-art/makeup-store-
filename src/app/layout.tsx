import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { AdminNameProvider } from "@/lib/admin-name-context";
import { ToastProvider } from "@/components/toast";
import { Header } from "@/components/header";

export const metadata: Metadata = {
  title: "Belle - Maquiagem com Amor",
  description: "Maquiagem com envio rapido - estoque proprio e parceiros selecionados.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'%F0%9F%92%84</text></svg>" />
      </head>
      <body>
        <CartProvider>
          <AdminNameProvider>
            <ToastProvider>
              <Header />
              <main style={{ minHeight: "calc(100vh - 60px)" }}>{children}</main>
            </ToastProvider>
          </AdminNameProvider>
        </CartProvider>
      </body>
    </html>
  );
}
