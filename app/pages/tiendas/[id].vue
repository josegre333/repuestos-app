<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Breadcrumb -->
    <nav class="text-sm text-gray-500 mb-6 flex gap-2">
      <NuxtLink to="/" class="hover:text-blue-600">Inicio</NuxtLink>
      <span>/</span>
      <NuxtLink to="/tiendas" class="hover:text-blue-600">Tiendas</NuxtLink>
      <span>/</span>
      <span class="text-gray-700">{{ location?.name }}</span>
    </nav>

    <div v-if="location" class="grid lg:grid-cols-5 gap-8">
      <!-- Info + Mapa -->
      <div class="lg:col-span-2 space-y-5">
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h1 class="text-2xl font-bold text-gray-800 mb-1">{{ location.name }}</h1>
          <p class="text-gray-500 text-sm">{{ location.address }}, {{ location.city }}</p>
          <p v-if="location.phone" class="text-blue-600 text-sm mt-2">📞 {{ location.phone }}</p>

          <div class="mt-4 pt-4 border-t grid grid-cols-2 gap-3 text-center">
            <div class="bg-green-50 rounded-lg p-3">
              <p class="text-2xl font-bold text-green-600">{{ inStockCount }}</p>
              <p class="text-xs text-gray-500">Con stock</p>
            </div>
            <div class="bg-blue-50 rounded-lg p-3">
              <p class="text-2xl font-bold text-blue-700">{{ location.productStock?.length || 0 }}</p>
              <p class="text-xs text-gray-500">Productos</p>
            </div>
          </div>
        </div>

        <ClientOnly>
          <LocationMap
            :locations="[{ id: location.id, name: location.name, address: location.address, city: location.city, phone: location.phone, lat: location.lat, lng: location.lng }]"
            :height="280"
          />
          <template #fallback>
            <div class="bg-gray-100 rounded-xl h-72 flex items-center justify-center text-gray-400">Cargando mapa...</div>
          </template>
        </ClientOnly>

        <a
          :href="`https://www.openstreetmap.org/directions?from=&to=${location.lat},${location.lng}`"
          target="_blank"
          class="block w-full text-center bg-blue-700 hover:bg-blue-600 text-white py-2.5 rounded-xl font-semibold transition-colors"
        >
          Cómo llegar
        </a>
      </div>

      <!-- Products at this location -->
      <div class="lg:col-span-3">
        <h2 class="text-xl font-bold text-gray-800 mb-4">
          Repuestos disponibles
          <span class="text-sm font-normal text-gray-500 ml-2">({{ location.productStock?.length || 0 }} items)</span>
        </h2>

        <div class="space-y-3">
          <div
            v-for="item in location.productStock"
            :key="item.id"
            class="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4"
          >
            <NuxtLink :to="`/producto/${item.product.slug}`">
              <img
                :src="getFirstImage(item.product.images) || '/placeholder.svg'"
                class="w-16 h-16 object-cover rounded-lg flex-shrink-0"
              />
            </NuxtLink>
            <div class="flex-1 min-w-0">
              <NuxtLink :to="`/producto/${item.product.slug}`" class="font-semibold text-gray-800 hover:text-blue-700 block truncate">
                {{ item.product.name }}
              </NuxtLink>
              <p v-if="item.product.sku" class="text-xs text-gray-400">SKU: {{ item.product.sku }}</p>
              <p class="text-blue-700 font-bold mt-1">${{ formatPrice(Number(item.product.price)) }}</p>
            </div>
            <div class="flex-shrink-0 text-right">
              <span
                class="px-3 py-1.5 rounded-full text-sm font-semibold"
                :class="item.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'"
              >
                {{ item.stock > 0 ? `${item.stock} und.` : 'Agotado' }}
              </span>
            </div>
          </div>

          <p v-if="!location.productStock?.length" class="text-center text-gray-400 py-12">
            Sin productos registrados en esta tienda
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const { data: location } = await useFetch(`/api/locations/${route.params.id}`)

const inStockCount = computed(() =>
  location.value?.productStock?.filter((i: any) => i.stock > 0).length || 0
)

function getFirstImage(images: string | null | undefined) {
  if (!images) return null
  try {
    const arr = JSON.parse(images)
    return Array.isArray(arr) ? arr[0] : images
  } catch { return images }
}

function formatPrice(n: number) {
  return n.toLocaleString('es-VE', { minimumFractionDigits: 2 })
}

useSeoMeta({ title: () => location.value?.name ? `${location.value.name} - Repuestos Auto` : 'Tienda' })
</script>
