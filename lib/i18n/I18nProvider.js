"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  LOCALES,
  dictionaries,
} from "./dictionaries";

const I18nContext = createContext(null);

function interpolate(template, vars = {}) {
  if (!template || typeof template !== "string") return template ?? "";
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    vars[key] !== undefined && vars[key] !== null ? String(vars[key]) : `{${key}}`
  );
}

function getByPath(obj, path) {
  return path.split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(DEFAULT_LOCALE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
      if (LOCALES.includes(saved)) {
        setLocaleState(saved);
      }
    } catch {
      // ignore
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const dir = locale === "fa" ? "rtl" : "ltr";
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
    const title = dictionaries[locale]?.brand?.title;
    if (title) document.title = title;
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      // ignore
    }
  }, [locale, ready]);

  const setLocale = useCallback((next) => {
    if (!LOCALES.includes(next)) return;
    setLocaleState(next);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocaleState((prev) => (prev === "fa" ? "en" : "fa"));
  }, []);

  const t = useCallback(
    (key, vars) => {
      const dict = dictionaries[locale] || dictionaries[DEFAULT_LOCALE];
      const fallback = dictionaries[DEFAULT_LOCALE];
      const value = getByPath(dict, key) ?? getByPath(fallback, key) ?? key;
      return interpolate(value, vars);
    },
    [locale]
  );

  const value = useMemo(
    () => ({
      locale,
      dir: locale === "fa" ? "rtl" : "ltr",
      isRtl: locale === "fa",
      ready,
      setLocale,
      toggleLocale,
      t,
      brandName: dictionaries[locale]?.brand?.name || "نیمبوس",
    }),
    [locale, ready, setLocale, toggleLocale, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}
