/** Client-safe iOS / PWA install detection helpers */

export function isIOSDevice(ua = typeof navigator !== "undefined" ? navigator.userAgent : "") {
  if (!ua) return false;
  const iOS = /iPad|iPhone|iPod/i.test(ua);
  // iPadOS 13+ can report as MacIntel with touch
  const iPadOs =
    typeof navigator !== "undefined" &&
    navigator.platform === "MacIntel" &&
    navigator.maxTouchPoints > 1;
  return iOS || iPadOs;
}

export function isStandaloneDisplay() {
  if (typeof window === "undefined") return false;
  const mq = window.matchMedia?.("(display-mode: standalone)")?.matches;
  // iOS Safari legacy
  const iosStandalone = window.navigator?.standalone === true;
  return Boolean(mq || iosStandalone);
}

export function isSafariBrowser(ua = typeof navigator !== "undefined" ? navigator.userAgent : "") {
  if (!ua) return false;
  const isSafari = /Safari/i.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS|Chrome|Android/i.test(ua);
  return isSafari || (isIOSDevice(ua) && /Safari/i.test(ua) && !/CriOS|FxiOS|EdgiOS/i.test(ua));
}

/** True when we should guide the user to Add to Home Screen */
export function shouldPromptAddToHome() {
  return isIOSDevice() && !isStandaloneDisplay();
}

export const A2HS_DISMISS_KEY = "nimbus_a2hs_dismissed";

export function isAddToHomeDismissed() {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(A2HS_DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

export function dismissAddToHome() {
  try {
    window.localStorage.setItem(A2HS_DISMISS_KEY, "1");
  } catch {
    /* ignore */
  }
}
