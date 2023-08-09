/// <reference types="vite/client" />
/// <reference types="./src/types/index.d.ts" />

interface ImportMetaEnv {
  // BASE_URL
  readonly VITE_BASE_URL: string;
  // websocket 服务端
  readonly VITE_WEBSOCKET_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
