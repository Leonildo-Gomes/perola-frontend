import { isApiError } from "@/lib/api/client";

/** Maps API errors to Portuguese (CV) user-facing messages. */
export function authErrorMessage(e: unknown, context: "login" | "register"): string {
  if (isApiError(e)) {
    if (e.status === 0) return "Falha de ligação à rede. Verifique a sua ligação e tente novamente.";
    if (e.status === 401) return "Email ou palavra-passe incorretos. Por favor, verifique as suas credenciais.";
    if (e.status === 403) return "Conta inativa ou bloqueada. Contacte o suporte Pérola.";
    if (e.status === 400 && context === "register") {
      return "Verifique os dados introduzidos. O telemóvel deve ter 7 dígitos de uma rede válida em Cabo Verde.";
    }
    if (e.status >= 500) return "O servidor está indisponível de momento. Tente novamente dentro de instantes.";
  }
  return "Ocorreu um erro inesperado. Tente novamente.";
}
