/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string;
  readonly VITE_SITE_NAME?: string;
  readonly VITE_ENABLE_DEMO_MODE?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_CALENDAR_BOOKING_URL?: string;
  readonly VITE_HAVALI_PROVIDER?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
