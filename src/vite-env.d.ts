/// <reference types="vite/client" />

// Allow importing HTML files as raw strings via Vite's ?raw suffix
declare module '*.html?raw' {
  const content: string;
  export default content;
}

// Allow importing SVG files as raw strings via Vite's ?raw suffix
declare module '*.svg?raw' {
  const content: string;
  export default content;
}
