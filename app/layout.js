import { Lalezar, Vazirmatn } from "next/font/google";
import AppToaster from "../components/AppToaster";
import Providers from "../components/Providers";
import RegisterSW from "../components/RegisterSW";
import { APP_NAME, APP_TAGLINE, APP_TITLE } from "../lib/brand";
import "./globals.css";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const brandFont = Lalezar({
  variable: "--font-brand",
  subsets: ["arabic", "latin"],
  weight: "400",
});

const THEME_COLOR = "#1e55d6";

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: THEME_COLOR },
    { media: "(prefers-color-scheme: dark)", color: "#0f131c" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  colorScheme: "light",
};

export const metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_TITLE,
    template: `%s | نیمبوس`,
  },
  description: APP_TAGLINE,
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/icon-192.png"],
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="fa"
      dir="rtl"
      data-theme="light"
      className={`${vazirmatn.variable} ${brandFont.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full font-sans text-cs-ink">
        <Providers>
          {children}
          <AppToaster />
          <RegisterSW />
        </Providers>
      </body>
    </html>
  );
}
