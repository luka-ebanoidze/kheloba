import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `npm run build` → ჩვეულებრივი build (dist/)
// `npm run build:single` → ერთ HTML ფაილად აწყობილი ვერსია (დემოსთვის)
export default defineConfig(({ mode }) => ({
  plugins: mode === 'single' ? [react(), viteSingleFile()] : [react()],
  base: './',
}))
