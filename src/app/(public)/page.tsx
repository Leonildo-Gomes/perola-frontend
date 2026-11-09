import { Suspense } from "react";
import { ServiceFeed } from "@/features/marketplace/components";

export default function HomePage() {
  return (
    <Suspense>
      <ServiceFeed variant="home" />
    </Suspense>
  );
}
