"use client";

import { Suspense } from "react";
import PageLoader from "../../components/PageLoader";
import PlansPageClient from "./PlansPageClient";

export default function PlansPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <PlansPageClient />
    </Suspense>
  );
}
