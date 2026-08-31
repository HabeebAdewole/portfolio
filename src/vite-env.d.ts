/// <reference types="vite/client" />

/* Both are optional on purpose: with neither set the Log section does not
   render at all, and the site builds and deploys exactly as it did before. */
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
