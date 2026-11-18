import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // strictPort: fail loudly instead of silently switching to 5174/5175, which the backend would not expect.
  server: { port: 5173, strictPort: true },
});
