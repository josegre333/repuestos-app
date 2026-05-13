<template>
  <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
    <NuxtLink :to="`/producto/${product.slug}`">
      <div class="aspect-square overflow-hidden bg-gray-100">
        <img
          :src="firstImage || '/placeholder.svg'"
          :alt="product.name"
          class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
    </NuxtLink>

    <div class="p-4">
      <p class="text-xs text-blue-600 font-medium mb-1">{{ product.category?.name }}</p>
      <NuxtLink :to="`/producto/${product.slug}`">
        <h3 class="font-semibold text-gray-800 hover:text-blue-700 line-clamp-2 text-sm leading-snug">
          {{ product.name }}
        </h3>
      </NuxtLink>
      <p v-if="product.sku" class="text-xs text-gray-400 mt-1">SKU: {{ product.sku }}</p>

      <div class="flex items-center justify-between mt-3">
        <span class="text-xl font-bold text-blue-700">${{ formatPrice(Number(product.price)) }}</span>
        <span
          class="text-xs px-2 py-1 rounded-full font-medium"
          :class="product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'"
        >
          {{ product.stock > 0 ? `${product.stock} disp.` : 'Agotado' }}
        </span>
      </div>

      <button
        @click="addToCart"
        :disabled="product.stock === 0"
        class="w-full mt-3 py-2 rounded-lg text-sm font-semibold transition-colors"
        :class="product.stock > 0
          ? 'bg-blue-700 hover:bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-400 cursor-not-allowed'"
      >
        {{ product.stock > 0 ? 'Agregar al carrito' : 'Sin stock' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

const props = defineProps<{
  product: {
    id: number
    name: string
    slug: string
    price: number | string
    stock: number
    images?: string | null
    sku?: string | null
    category?: { name: string; slug: string } | null
  }
}>()

const cartStore = useCartStore()

const firstImage = computed(() => {
  if (!props.product.images) return null
  try {
    const arr = JSON.parse(props.product.images)
    return Array.isArray(arr) ? arr[0] : props.product.images
  } catch {
    return props.product.images
  }
})

function formatPrice(n: number) {
  return n.toLocaleString('es-VE', { minimumFractionDigits: 2 })
}

function addToCart() {
  cartStore.addItem({
    productId: props.product.id,
    name: props.product.name,
    price: Number(props.product.price),
    image: props.product.images || null,
    stock: props.product.stock,
  })
  cartStore.isOpen = true
}
</script>
