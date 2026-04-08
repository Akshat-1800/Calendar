export function getSeason(monthIndex) {
  if (monthIndex >= 2 && monthIndex <= 4) {
    return "summer";
  }

  if (monthIndex >= 5 && monthIndex <= 8) {
    return "monsoon";
  }

  if (monthIndex >= 9 && monthIndex <= 10) {
    return "autumn";
  }

  return "winter";
}

export const THEMES = {
  summer: {
    primary: "bg-orange-500",
    primaryHover: "hover:bg-orange-600",
    border: "border-orange-500",
    light: "bg-orange-100",
    lightHover: "hover:bg-orange-200",
    preview: "bg-orange-50",
    previewHover: "hover:bg-orange-100",
    ring: "ring-orange-400",
    borderSoft: "border-orange-200",
    textStrong: "text-orange-700",
    textDark: "text-orange-900",
    focusBorder: "focus:border-orange-400",
    focusRing: "focus:ring-orange-100",
    headerGradient: "bg-linear-to-r from-orange-100/70 via-white to-transparent",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
  },
  monsoon: {
    primary: "bg-green-500",
    primaryHover: "hover:bg-green-600",
    border: "border-green-500",
    light: "bg-green-100",
    lightHover: "hover:bg-green-200",
    preview: "bg-green-50",
    previewHover: "hover:bg-green-100",
    ring: "ring-green-400",
    borderSoft: "border-green-200",
    textStrong: "text-green-700",
    textDark: "text-green-900",
    focusBorder: "focus:border-green-400",
    focusRing: "focus:ring-green-100",
    headerGradient: "bg-linear-to-r from-green-100/70 via-white to-transparent",
    image:
      "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1600&q=80",
  },
  autumn: {
    primary: "bg-yellow-500",
    primaryHover: "hover:bg-yellow-600",
    border: "border-yellow-500",
    light: "bg-yellow-100",
    lightHover: "hover:bg-yellow-200",
    preview: "bg-yellow-50",
    previewHover: "hover:bg-yellow-100",
    ring: "ring-yellow-400",
    borderSoft: "border-yellow-200",
    textStrong: "text-yellow-700",
    textDark: "text-yellow-900",
    focusBorder: "focus:border-yellow-400",
    focusRing: "focus:ring-yellow-100",
    headerGradient: "bg-linear-to-r from-yellow-100/70 via-white to-transparent",
    image:
      "https://images.unsplash.com/photo-1507371341162-763b5e419408?auto=format&fit=crop&w=1600&q=80",
  },
  winter: {
    primary: "bg-blue-500",
    primaryHover: "hover:bg-blue-600",
    border: "border-blue-500",
    light: "bg-blue-100",
    lightHover: "hover:bg-blue-200",
    preview: "bg-blue-50",
    previewHover: "hover:bg-blue-100",
    ring: "ring-blue-400",
    borderSoft: "border-blue-200",
    textStrong: "text-blue-700",
    textDark: "text-blue-900",
    focusBorder: "focus:border-blue-400",
    focusRing: "focus:ring-blue-100",
    headerGradient: "bg-linear-to-r from-blue-100/70 via-white to-transparent",
    image:
      "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=1600&q=80",
  },
};
