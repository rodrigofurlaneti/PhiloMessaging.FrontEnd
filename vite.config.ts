import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

// Para garantir compatibilidade com ESM (EcmaScript Modules)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            // Isso permite que você use '@/' em vez de '../../../../'
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        // Aumenta o limite para 1MB para silenciar o warning de chunks grandes
        chunkSizeWarningLimit: 1000,
        // Dica de Sênior: Se o build demorar, você pode habilitar o sourcemap
        sourcemap: false,
        rollupOptions: {
            output: {
                // Organiza os arquivos gerados em pastas para melhor manutenção no servidor
                chunkFileNames: 'assets/js/[name]-[hash].js',
                entryFileNames: 'assets/js/[name]-[hash].js',
                assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
            },
        },
    },
    // Configuração opcional: se o servidor rodar em porta específica
    server: {
        port: 3000,
        strictPort: true,
    }
})