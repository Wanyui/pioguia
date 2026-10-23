import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // On Vercel (production and previews) canonical URLs point at the production site.
  site: process.env.PUBLIC_SITE_URL || (process.env.VERCEL ? "https://pioguia.vercel.app" : "http://localhost:4321"),
  vite: {
    plugins: [tailwindcss()],
  },
});
