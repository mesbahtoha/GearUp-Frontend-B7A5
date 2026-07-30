"use client";

import Button from "@/components/ui/Button";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md px-4">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Critical Error</h1>
            <p className="text-gray-600 mb-6">{error.message || "Something went wrong"}</p>
            <Button onClick={reset}>Try Again</Button>
          </div>
        </div>
      </body>
    </html>
  );
}
