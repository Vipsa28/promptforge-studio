import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// React 18 compatible setup
export default defineConfig({
  plugins: [react()],
});
