<template>
  <!-- Overlay -->
  <Transition name="fade">
    <div
      v-if="cartStore.isOpen"
      class="fixed inset-0 bg-black/40 z-40"
      @click="cartStore.toggleCart()"
    />
  </Transition>

  <!-- Drawer -->
  <Transition name="slide">
    <div
      v-if="cartStore.isOpen"
      class="fixed right-0 top-0 h-full w-96 max-w-full bg-white shadow-2xl z-50 flex flex-col"
    >
      <div class="flex items-center justify-between p-4 border-b">
        <h2 class="font-bold text-lg">Carrito ({{ cartStore.itemCount }})</h2>
        <button @click="cartStore.toggleCart()" class="text-gray-500 hover:text-gray-700 text-xl">x</button>
      </div>

      <div class="flex-1 overflow-auto p-4 space-y-3">
        <div v-if="cartStore.items.length === 0" class="text-center text-gray-400 py-16">
          <p class="text-4xl mb-3">🛒</p>
          <p>El carrito está vacío</p>
        </div>

        <div
          v-for="item in cartStore.items"
          :key="item.productId"
          class="flex gap-3 bg-gray-50 rounded-lg p-3"
        >
          <img
            :src="getFirstImage(item.image) || '/placeholder.svg'"
            class="w-16 h-16 object-cover rounded"
            :alt="item.name"
          />
          <div class="flex-1 min-w-0">
            <p class="font-medium text-sm truncate">{{ item.name }}</p>
            <p class="text-blue-700 font-bold text-sm">${{ formatPrice(item.price) }}</p>
            <div class="flex items-center gap-2 mt-1">
              <button
                @click="cartStore.updateQuantity(item.productId, item.quantity - 1)"
                class="w-6 h-6 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
              >-</button>
              <span class="text-sm w-6 text-center">{{ item.quantity }}</span>
              <button
                @click="cartStore.updateQuantity(item.productId, item.quantity + 1)"
                class="w-6 h-6 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
              >+</button>
            </div>
          </div>
          <button @click="cartStore.removeItem(item.productId)" class="text-red-400 hover:text-red-600 text-lg leading-none">x</button>
        </div>
      </div>

      <div v-if="cartStore.items.length > 0" class="border-t p-4">
        <div class="flex justify-between font-bold text-lg mb-4">
          <span>Total:</span>
          <span class="text-blue-700">${{ formatPrice(cartStore.total) }}</span>
        </div>
        <NuxtLink
          to="/checkout"
          @click="cartStore.toggleCart()"
          class="block w-full bg-blue-700 hover:bg-blue-600 text-white text-center py-3 rounded-lg font-semibold transition-colors"
        >
          Proceder al checkout
        </NuxtLink>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()

function formatPrice(n: number) {
  return n.toLocaleString('es-VE', { minimumFractionDigits: 2 })
}

function getFirstImage(images: string | null) {
  if (!images) return null
  try {
    const arr = JSON.parse(images)
    return Array.isArray(arr) ? arr[0] : images
  } catch {
    return images
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-enter-active, .slide-leave-active { transition: transform 0.3s ease; }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }
</style>
