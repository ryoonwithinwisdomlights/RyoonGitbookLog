"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="p-6">
          <h2 className="text-lg font-semibold">Something went wrong</h2>
          <p className="mt-2 text-sm text-neutral-600">
            An unexpected error occurred. Please try again.
          </p>
          <button
            className="mt-4 rounded bg-neutral-900 px-4 py-2 text-sm text-white"
            onClick={() => reset()}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}

