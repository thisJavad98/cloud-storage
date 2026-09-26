import { APP_NAME, APP_NAME_EN, APP_TAGLINE } from "../lib/brand";

/** @type {import('next').MetadataRoute.Manifest} */
export default function manifest() {
  return {
    id: "/",
    name: `${APP_NAME} — ${APP_NAME_EN}`,
    short_name: APP_NAME,
    description: APP_TAGLINE,
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "minimal-ui", "browser"],
    orientation: "portrait-primary",
    background_color: "#1f4fc4",
    theme_color: "#1f4fc4",
    lang: "fa",
    dir: "rtl",
    categories: ["productivity", "utilities"],
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-192-maskable.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
