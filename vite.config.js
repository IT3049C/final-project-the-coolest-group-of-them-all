import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/final-project-the-coolest-group-of-them-all/",
  plugins: [react()],
  server: { port: 5173, open: false },
  preview: { port: 5173 },
});