/// <reference types="vite/client" />

// Allow importing plain CSS files as side-effects
declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}
