"use client";

import { I18nProvider } from "../lib/i18n/I18nProvider";
import { ThemeProvider } from "../lib/theme/ThemeProvider";
import SessionSync from "./SessionSync";

export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <I18nProvider>
        <SessionSync />
        {children}
      </I18nProvider>
    </ThemeProvider>
  );
}
