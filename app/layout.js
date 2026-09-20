import { Vazirmatn } from "next/font/google";
import AppToaster from "../components/AppToaster";
import Providers from "../components/Providers";
import { APP_TAGLINE, APP_TITLE } from "../lib/brand";
import "./globals.css";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: {
    default: APP_TITLE,
    template: `%s | نیمبوس`,
  },
  description: APP_TAGLINE,
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png", type: "image/png" }],
    shortcut: ["/icon.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="fa"
      dir="rtl"
      data-theme="light"
      className={`${vazirmatn.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full font-sans text-cs-ink">
        <Providers>
          {children}
          <AppToaster />
        </Providers>
      </body>
    </html>
  );
}
