import { Suspense } from "react";
import { ServiceFeed } from "@/components/marketplace/service-feed";

export default function HomePage() {
  return (
    <Suspense>
      <ServiceFeed variant="home" />
    </Suspense>
  );
}
