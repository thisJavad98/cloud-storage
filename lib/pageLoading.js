export const PAGE_LOAD_MIN_MS = 0;

/** Keeps the page loader visible for at least `minMs` from `startedAt`. */
export async function finishPageLoad(
  startedAt = Date.now(),
  minMs = PAGE_LOAD_MIN_MS
) {
  const elapsed = Date.now() - startedAt;
  const wait = Math.max(0, minMs - elapsed);
  if (wait > 0) {
    await new Promise((resolve) => setTimeout(resolve, wait));
  }
}
