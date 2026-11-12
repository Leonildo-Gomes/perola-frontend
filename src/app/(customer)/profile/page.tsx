import type { Metadata } from "next";
import { UserProfileContainer } from "@/features/profile/components/user-profile-container";

export const metadata: Metadata = {
  title: "O Meu Perfil | Pérola",
  description: "Atualize a sua fotografia de perfil e contactos na plataforma Pérola.",
};

export default function ProfilePage() {
  return <UserProfileContainer />;
}

