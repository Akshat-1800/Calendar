"use client";

import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

const MOBILE_QUERY = "(max-width: 639px)";

export default function AppToaster() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.matchMedia(MOBILE_QUERY).matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_QUERY);

    function handleChange(event) {
      setIsMobile(event.matches);
    }

    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <Toaster
      position={isMobile ? "top-center" : "top-right"}
      gutter={10}
      containerStyle={{ top: 16, left: 16, right: 16 }}
      toastOptions={{
        duration: 2600,
        style: {
          borderRadius: "12px",
          background: "#111827",
          color: "#f8fafc",
          fontSize: "14px",
          fontWeight: 500,
          padding: "10px 14px",
          boxShadow: "0 8px 20px rgba(15, 23, 42, 0.2)",
        },
        success: {
          iconTheme: {
            primary: "#3b82f6",
            secondary: "#eff6ff",
          },
        },
      }}
    />
  );
}
