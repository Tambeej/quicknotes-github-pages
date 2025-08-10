import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/quicknotes-github-pages/",
  plugins: [react()],
});
