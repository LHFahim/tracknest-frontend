"use client";

import { useEffect } from "react";

export default function AboutError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.log(error);
  }, [error]);

  return (
    <div>
      <p>Failed to load about page. Please try again later.</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
