import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ✅ Clean React 18 compatible setup
export default defineConfig({
  plugins: [react()],
});
