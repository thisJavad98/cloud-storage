"use client";

import { usePathname } from "next/navigation";

const THISJ_URL =
  "https://www.linkedin.com/in/mohammad-javad-moghofei-907671214/";

/** Routes where the fixed credit bar fights the layout (auth / install). */
const HIDDEN_PATHS = new Set(["/login", "/signup", "/add-to-home"]);

export default function SiteFooter() {
  const pathname = usePathname() || "/";
  const hiddenByRoute = HIDDEN_PATHS.has(pathname);

  if (hiddenByRoute) return null;

  return (
    <footer className="site-footer" role="contentinfo">
      <p className="site-footer__text">
        Powered by{" "}
        <a
          href={THISJ_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="site-footer__link"
        >
          ThisJ
        </a>
      </p>
    </footer>
  );
}
