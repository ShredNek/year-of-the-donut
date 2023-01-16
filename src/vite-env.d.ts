// <reference types="vite/client" />;

interface ImportMetaEnv
  extends Readonly<Record<string, string | boolean | undefined>> {
  readonly VITE_APP_TITLE: string;
  MONGO_DB_URI: string;
  VITE_PORT: string;
  VITE_SERVER_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
