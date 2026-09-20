"use client";

import { I18nProvider } from "../lib/i18n/I18nProvider";

export default function Providers({ children }) {
  return <I18nProvider>{children}</I18nProvider>;
}
