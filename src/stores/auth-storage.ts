import type { StateStorage } from "zustand/middleware";

const REMEMBER_KEY = "perola-remember";

/** Choose where the session lives: `localStorage` (remember me) or `sessionStorage`. */
export function setRememberSession(remember: boolean) {
  if (typeof window === "undefined") return;
  if (remember) localStorage.removeItem(REMEMBER_KEY);
  else localStorage.setItem(REMEMBER_KEY, "0");
}

const shouldRemember = () => localStorage.getItem(REMEMBER_KEY) !== "0";

/** Persist storage for the auth store honouring "Manter sessão iniciada". */
export const authStorage: StateStorage = {
  getItem: (name) => sessionStorage.getItem(name) ?? localStorage.getItem(name),
  setItem: (name, value) => {
    if (shouldRemember()) {
      localStorage.setItem(name, value);
      sessionStorage.removeItem(name);
    } else {
      sessionStorage.setItem(name, value);
      localStorage.removeItem(name);
    }
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
    sessionStorage.removeItem(name);
  },
};
