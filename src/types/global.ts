// React types
declare module 'react' {
  interface CSSProperties {
    [key: string]: any;
  }
}

// Window extension for service worker and PWA install
declare global {
  interface Window {
    deferredPrompt?: Event & { prompt: () => Promise<void> };
  }
}

export {};

