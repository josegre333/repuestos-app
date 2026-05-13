<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Navbar -->
    <header class="bg-blue-800 text-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <NuxtLink to="/" class="flex items-center gap-2">
            <span class="text-2xl">🔧</span>
            <span class="font-bold text-xl">Repuestos Auto</span>
          </NuxtLink>

          <nav class="hidden md:flex items-center gap-6 text-sm font-medium">
            <NuxtLink to="/" class="hover:text-blue-200 transition-colors">Inicio</NuxtLink>
            <NuxtLink to="/catalogo" class="hover:text-blue-200 transition-colors">Catálogo</NuxtLink>
            <NuxtLink to="/tiendas" class="hover:text-blue-200 transition-colors">Tiendas</NuxtLink>
          </nav>

          <button
            @click="cartStore.toggleCart()"
            class="relative flex items-center gap-2 bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span>Carrito</span>
            <span
              v-if="cartStore.itemCount > 0"
              class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            >{{ cartStore.itemCount }}</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Cart Drawer -->
    <CartDrawer />

    <!-- Main content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-blue-900 text-blue-200 py-8 mt-12">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <p class="font-semibold text-white mb-1">Repuestos Auto</p>
        <p class="text-sm">Catálogo de repuestos para vehículos</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'
const cartStore = useCartStore()
</script>
