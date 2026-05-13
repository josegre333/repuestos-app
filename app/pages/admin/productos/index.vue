<template>
  <div class="p-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Productos</h1>
      <NuxtLink
        to="/admin/productos/nuevo"
        class="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
      >
        + Nuevo Producto
      </NuxtLink>
    </div>

    <!-- Search -->
    <div class="flex gap-3 mb-6">
      <input
        v-model="search"
        @input="debouncedFetch"
        type="text"
        placeholder="Buscar por nombre o SKU..."
        class="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b">
            <tr class="text-left text-gray-500">
              <th class="px-4 py-3">Producto</th>
              <th class="px-4 py-3">SKU</th>
              <th class="px-4 py-3">Categoría</th>
              <th class="px-4 py-3">Precio</th>
              <th class="px-4 py-3">Stock</th>
              <th class="px-4 py-3">Estado</th>
              <th class="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr v-for="p in products" :key="p.id" class="hover:bg-gray-50">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <img :src="getFirstImage(p.images) || '/placeholder.svg'" class="w-10 h-10 rounded object-cover" />
                  <span class="font-medium text-gray-800 max-w-xs truncate">{{ p.name }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-gray-500 font-mono text-xs">{{ p.sku || '—' }}</td>
              <td class="px-4 py-3 text-gray-600">{{ p.category?.name }}</td>
              <td class="px-4 py-3 font-semibold text-blue-700">${{ formatPrice(Number(p.price)) }}</td>
              <td class="px-4 py-3">
                <span
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  :class="p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'"
                >{{ p.stock }}</span>
              </td>
              <td class="px-4 py-3">
                <span class="text-xs" :class="p.active ? 'text-green-600' : 'text-gray-400'">
                  {{ p.active ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex gap-2">
                  <NuxtLink :to="`/admin/productos/${p.id}`" class="text-blue-600 hover:underline text-xs">Editar</NuxtLink>
                  <button @click="deleteProduct(p.id)" class="text-red-400 hover:text-red-600 text-xs">Eliminar</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-if="!products.length && !pending" class="text-center text-gray-400 py-12">No hay productos</p>
        <div v-if="pending" class="py-8 text-center text-gray-400">Cargando...</div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center gap-2 p-4 border-t">
        <button
          v-for="p in totalPages"
          :key="p"
          @click="fetchProducts(p)"
          class="px-3 py-1 rounded text-sm font-medium"
          :class="currentPage === p ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
        >{{ p }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'admin' })

const search = ref('')
const products = ref<any[]>([])
const total = ref(0)
const totalPages = ref(1)
const currentPage = ref(1)
const pending = ref(false)

async function fetchProducts(page = 1) {
  pending.value = true
  currentPage.value = page
  try {
    const data = await $fetch('/api/products', {
      query: { page, limit: 20, search: search.value || undefined },
    })
    products.value = data.products
    total.value = data.total
    totalPages.value = data.totalPages
  } finally {
    pending.value = false
  }
}

let debounceTimer: ReturnType<typeof setTimeout>
function debouncedFetch() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => fetchProducts(1), 400)
}

async function deleteProduct(id: number) {
  if (!confirm('¿Eliminar este producto?')) return
  await $fetch(`/api/products/${id}`, { method: 'DELETE' })
  fetchProducts(currentPage.value)
}

function getFirstImage(images: string | null) {
  if (!images) return null
  try {
    const arr = JSON.parse(images)
    return Array.isArray(arr) ? arr[0] : images
  } catch { return images }
}

function formatPrice(n: number) {
  return n.toLocaleString('es-VE', { minimumFractionDigits: 2 })
}

await fetchProducts()
useSeoMeta({ title: 'Productos - Admin' })
</script>
