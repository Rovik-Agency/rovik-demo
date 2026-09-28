type EventPayload = Record<string, string | number | boolean | undefined>;

export function track(event: string, payload: EventPayload = {}) {
  window.dispatchEvent(new CustomEvent('rovik:analytics', { detail: { event, payload, ts: Date.now() } }));
  if (import.meta.env.DEV) console.info('[analytics]', event, payload);
}
