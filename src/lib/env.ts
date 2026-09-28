export const env = {
  siteUrl: import.meta.env.VITE_SITE_URL || 'https://rovik.example',
  siteName: import.meta.env.VITE_SITE_NAME || 'ROVIK',
  demoMode: import.meta.env.VITE_ENABLE_DEMO_MODE !== 'false',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  bookingUrl: import.meta.env.VITE_CALENDAR_BOOKING_URL || '/contact',
  havaliProvider: import.meta.env.VITE_HAVALI_PROVIDER || 'hybrid'
};

export const hasSupabase = Boolean(env.supabaseUrl && env.supabaseAnonKey && env.supabaseUrl.includes('supabase'));
