import { defineConfig } from "vite";

export default defineConfig({
  server: {
    hmr: {
      clientPort: 5173, // Ensure it matches the correct port
    },
  },
});
