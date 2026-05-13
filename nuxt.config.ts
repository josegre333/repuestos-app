import { fileURLToPath } from 'url'
import { resolve, dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || 'repuestos-secret-key-2024',
    databaseUrl: process.env.DATABASE_URL || '',
    public: {
      appName: 'Repuestos Auto',
    }
  },
  nitro: {
    alias: {
      '#prisma': resolve(__dirname, './app/generated/prisma'),
    },
    experimental: {
      wasm: true
    }
  }
})
