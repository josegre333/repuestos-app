<template>
  <div class="p-8 max-w-4xl">
    <div class="flex items-center gap-3 mb-2">
      <NuxtLink to="/admin/ubicaciones" class="text-gray-400 hover:text-gray-600">← Volver</NuxtLink>
      <h1 class="text-2xl font-bold text-gray-800">Stock en: {{ location?.name }}</h1>
    </div>
    <p class="text-gray-500 text-sm mb-6">
      Asigna cuántas unidades de cada producto hay disponibles en esta sucursal.
      El stock total del producto se actualiza automáticamente.
    </p>

    <div class="grid lg:grid-cols-5 gap-6">
      <!-- Mini mapa -->
      <div class="lg:col-span-2">
        <ClientOnly>
          <LocationMap
            v-if="location"
            :locations="[{ id: location.id, name: location.name, address: location.address, city: location.city, phone: location.phone, lat: location.lat, lng: location.lng }]"
            :height="260"
          />
          <template #fallback>
            <div class="bg-gray-100 rounded-xl h-64 flex items-center justify-center text-gray-400">Cargando...</div>
          </template>
        </ClientOnly>

        <div v-if="location" class="bg-white rounded-xl shadow-sm p-4 mt-4">
          <p class="text-sm text-gray-500">{{ location.address }}</p>
          <p class="text-sm text-gray-500">{{ location.city }}</p>
          <p v-if="location.phone" class="text-sm text-blue-600">{{ location.phone }}</p>
        </div>
      </div>

      <!-- Stock por producto -->
      <div class="lg:col-span-3">
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <div class="px-5 py-4 border-b flex items-center justify-between">
            <p class="font-semibold">Productos</p>
            <input
              v-model="searchProduct"
              type="text"
              placeholder="Buscar..."
              class="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-40"
            />
          </div>

          <div class="divide-y max-h-[420px] overflow-auto">
            <div
              v-for="p in filteredProducts"
              :key="p.id"
              class="flex items-center gap-3 px-5 py-3"
            >
              <img :src="getFirstImage(p.images) || '/placeholder.svg'" class="w-10 h-10 rounded object-cover flex-shrink-0" />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium truncate">{{ p.name }}</p>
                <p class="text-xs text-gray-400">SKU: {{ p.sku || '—' }}</p>
              </div>
              <div class="flex items-center gap-1.5 flex-shrink-0">
                <button
                  @click="adjustStock(p.id, -1)"
                  class="w-7 h-7 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded font-bold"
                >-</button>
                <input
                  :value="getStock(p.id)"
                  @change="setStock(p.id, parseInt(($event.target as HTMLInputElement).value) || 0)"
                  type="number"
                  min="0"
                  class="w-16 text-center border rounded-lg py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
                <button
                  @click="adjustStock(p.id, 1)"
                  class="w-7 h-7 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded font-bold"
                >+</button>
              </div>
            </div>
          </div>

          <div class="px-5 py-4 border-t flex items-center justify-between">
            <p class="text-sm text-gray-500">{{ changedCount }} cambio(s) sin guardar</p>
            <button
              @click="save"
              :disabled="saving || changedCount === 0"
              class="bg-blue-700 hover:bg-blue-600 disabled:bg-gray-300 text-white px-5 py-2 rounded-lg text-sm font-semibold"
            >
              {{ saving ? 'Guardando...' : 'Guardar stock' }}
            </button>
          </div>
        </div>

        <p v-if="saved" class="text-green-600 text-sm font-medium mt-3 text-center">
          Stock actualizado correctamente
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'admin' })

const route = useRoute()
const locId = parseInt(route.params.id as string)

const { data: location } = await useFetch(`/api/locations/${locId}`)
const { data: productsData } = await useFetch('/api/products', { query: { limit: 500 } })

const products = computed(() => productsData.value?.products || [])

const stockMap = ref<Record<number, number>>({})
const originalMap = ref<Record<number, number>>({})
const searchProduct = ref('')
const saving = ref(false)
const saved = ref(false)

// Cargar stock existente desde la ubicación
watch(location, (loc) => {
  if (!loc?.productStock) return
  for (const item of (loc.productStock as any[])) {
    stockMap.value[item.productId] = item.stock
    originalMap.value[item.productId] = item.stock
  }
}, { immediate: true })

const filteredProducts = computed(() => {
  if (!searchProduct.value) return products.value
  const q = searchProduct.value.toLowerCase()
  return (products.value as any[]).filter((p) =>
    p.name.toLowerCase().includes(q) || (p.sku || '').toLowerCase().includes(q)
  )
})

const changedCount = computed(() =>
  Object.entries(stockMap.value).filter(([id, val]) => val !== (originalMap.value[Number(id)] ?? 0)).length
)

function getStock(productId: number): number {
  return stockMap.value[productId] ?? 0
}

function setStock(productId: number, value: number) {
  stockMap.value[productId] = Math.max(0, value)
}

function adjustStock(productId: number, delta: number) {
  stockMap.value[productId] = Math.max(0, (stockMap.value[productId] ?? 0) + delta)
}

async function save() {
  saving.value = true
  saved.value = false
  try {
    for (const p of (products.value as any[])) {
      const stock = stockMap.value[p.id] ?? 0
      const original = originalMap.value[p.id] ?? 0
      if (stock !== original) {
        await $fetch(`/api/products/${p.id}/locations`, {
          method: 'PUT',
          body: { locations: [{ locationId: locId, stock }] },
        })
        originalMap.value[p.id] = stock
      }
    }
    saved.value = true
    setTimeout(() => (saved.value = false), 3000)
  } finally {
    saving.value = false
  }
}

function getFirstImage(images: string | null) {
  if (!images) return null
  try { const arr = JSON.parse(images); return Array.isArray(arr) ? arr[0] : images } catch { return images }
}

useSeoMeta({ title: 'Stock por Ubicación - Admin' })
</script>
