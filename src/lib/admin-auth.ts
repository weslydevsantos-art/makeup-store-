import { NextResponse } from "next/server";

/**
 * Proteção mínima do painel admin: exige um header x-admin-password
 * batendo com ADMIN_PASSWORD. É só pra não deixar a rota totalmente
 * aberta enquanto o projeto é um MVP — troque por autenticação de
 * verdade (NextAuth, Clerk, etc.) antes de ir pra produção com dados
 * reais de clientes.
 */
export function requireAdmin(req: Request) {
  const password = req.headers.get("x-admin-password");
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  return null;
}
