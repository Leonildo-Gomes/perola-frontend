import type { Metadata } from "next";
import { Suspense } from "react";
import { ServiceFeed } from "@/components/marketplace/service-feed";

export const metadata: Metadata = {
  title: "Explorar serviços — Pérola",
  description: "Encontre salões, barbearias e spas em Cabo Verde e agende online.",
};

export default function ExplorePage() {
  return (
    <Suspense>
      <ServiceFeed variant="explore" />
    </Suspense>
  );
}
