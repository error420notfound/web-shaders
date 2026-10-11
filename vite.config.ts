import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ command, isPreview }) => {
  const base = command === "build" || isPreview ? "/web-shaders/" : "/";
  return {
    base,
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: "prompt",
        injectRegister: "script-defer",
        includeAssets: [
          "icons/*.png",
          "icons/*.svg",
          "social-preview.png",
          "sample-object.svg",
        ],
        manifest: {
          id: base,
          name: "Shader Workshop",
          short_name: "Shaders",
          description:
            "Author shader compositions and reusable motion scenes in your browser. Your projects stay on your device.",
          start_url: base,
          scope: base,
          display: "standalone",
          background_color: "#f7f6f3",
          theme_color: "#27292e",
          lang: "en",
          icons: [
            {
              src: "icons/icon-192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "icons/icon-512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "icons/icon-maskable-512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,svg,png,woff,woff2,webmanifest}"],
          maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
          navigateFallback: `${base}index.html`,
          // Bootstrap Icons appends a content hash as a query parameter.
          ignoreURLParametersMatching: [/^utm_/, /^fbclid$/, /^[a-f0-9]{32}$/i],
          // Waiting updates activate after all old app windows close, never mid-edit.
          skipWaiting: false,
          clientsClaim: true,
          cleanupOutdatedCaches: true,
        },
      }),
    ],
    server: { port: 5173 },
  };
});
