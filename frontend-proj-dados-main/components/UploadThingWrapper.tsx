"use client";

import { useEffect } from "react";

export function UploadThingWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Dynamically import UploadThing CSS only when this component mounts
    void import("@uploadthing/react/styles.css" as string).catch(() => {
      // Silently handle import errors - CSS may already be loaded
    });
  }, []);

  return <>{children}</>;
}
