"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import ErrorComponent from "@/modules/common/components/shared/ErrorComponent";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Safe even when SENTRY_DSN is not configured (Sentry stays disabled).
    Sentry.captureException(error);
  }, [error]);

  return <ErrorComponent />;
}
