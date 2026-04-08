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
        className: "toast-slide-in",
        duration: 2400,
        style: {
          borderRadius: "12px",
          border: "1px solid #e4e4e7",
          background: "#ffffff",
          color: "#111827",
          fontSize: "14px",
          fontWeight: 600,
          padding: "10px 14px",
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
        },
        success: {
          iconTheme: {
            primary: "#2563eb",
            secondary: "#ffffff",
          },
        },
      }}
    />
  );
}
