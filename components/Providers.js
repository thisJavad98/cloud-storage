"use client";

import { I18nProvider } from "../lib/i18n/I18nProvider";
import { ThemeProvider } from "../lib/theme/ThemeProvider";
import AccountSync from "./AccountSync";

export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AccountSync />
        {children}
      </I18nProvider>
    </ThemeProvider>
  );
}
