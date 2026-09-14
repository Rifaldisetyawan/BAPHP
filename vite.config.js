// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// export default defineConfig({
//   plugins: [
//     react(),
//     tailwindcss(),
//   ],server: {
//     proxy: {
//       '/syno-api': {
//         target: 'https://10-40-9-2.datapu.direct.quickconnect.to:5001',
//         changeOrigin: true,
//         secure: false, // Mengabaikan verifikasi sertifikat SSL lokal
//         rewrite: (path) => path.replace(/^\/syno-api/, '')
//       }
//     }
//   }
// })
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api.php': {
        target: 'http://10.40.9.2:8085',
        changeOrigin: true,
        secure: false
      }
    }
  }
})