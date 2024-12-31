import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: '0.0.0.0',  // Expose to all network interfaces
        port: 5173,        // Default port for Vite
        hmr: {
        host: 'localhost', // Host for hot module replacement
        },
    },
});