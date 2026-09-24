import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), VitePWA({ registerType: 'autoUpdate', manifest: { name: "Mummy's Measure", short_name: "Mummy's Measure", description: 'Offline school uniform measurement register', theme_color: '#087d47', background_color: '#f7faf8', display: 'standalone', icons: [] } })],
})
