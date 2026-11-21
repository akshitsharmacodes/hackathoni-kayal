import type { MetadataRoute } from "next";

// D25: installable (add to home screen), no offline.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kayal · കായൽ",
    short_name: "Kayal",
    description: "Speak up for the backwaters.",
    start_url: "/report",
    display: "standalone",
    background_color: "#F8F3E6",
    theme_color: "#1F4D3A",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
