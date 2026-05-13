<template>
  <div v-if="product" class="max-w-5xl mx-auto px-4 py-8">
    <!-- Breadcrumb -->
    <nav class="text-sm text-gray-500 mb-6 flex gap-2">
      <NuxtLink to="/" class="hover:text-blue-600">Inicio</NuxtLink>
      <span>/</span>
      <NuxtLink to="/catalogo" class="hover:text-blue-600">Catálogo</NuxtLink>
      <span>/</span>
      <NuxtLink :to="`/catalogo?categoria=${product.category?.slug}`" class="hover:text-blue-600">
        {{ product.category?.name }}
      </NuxtLink>
      <span>/</span>
      <span class="text-gray-700">{{ product.name }}</span>
    </nav>

    <div class="grid md:grid-cols-2 gap-8">
      <!-- Images -->
      <div>
        <div class="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-3">
          <img
            :src="activeImage || '/placeholder.svg'"
            :alt="product.name"
            class="w-full h-full object-cover"
          />
        </div>
        <div v-if="images.length > 1" class="flex gap-2">
          <button
            v-for="(img, i) in images"
            :key="i"
            @click="activeImage = img"
            class="w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors"
            :class="activeImage === img ? 'border-blue-600' : 'border-transparent'"
          >
            <img :src="img" class="w-full h-full object-cover" />
          </button>
        </div>
      </div>

      <!-- Info -->
      <div>
        <p class="text-sm text-blue-600 font-medium mb-1">{{ product.category?.name }}</p>
        <h1 class="text-2xl font-bold text-gray-800 mb-2">{{ product.name }}</h1>
        <p v-if="product.sku" class="text-sm text-gray-400 mb-4">SKU: {{ product.sku }}</p>

        <div class="flex items-center gap-4 mb-6">
          <span class="text-4xl font-bold text-blue-700">${{ formatPrice(Number(product.price)) }}</span>
          <span
            class="px-3 py-1 rounded-full text-sm font-medium"
            :class="product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'"
          >
            {{ product.stock > 0 ? `${product.stock} en stock` : 'Agotado' }}
          </span>
        </div>

        <p v-if="product.description" class="text-gray-600 mb-6 leading-relaxed">{{ product.description }}</p>

        <div v-if="product.stock > 0" class="flex items-center gap-3 mb-4">
          <label class="text-sm font-medium text-gray-700">Cantidad:</label>
          <div class="flex items-center border rounded-lg overflow-hidden">
            <button @click="qty = Math.max(1, qty - 1)" class="px-3 py-2 hover:bg-gray-100">-</button>
            <span class="px-4 py-2 font-medium">{{ qty }}</span>
            <button @click="qty = Math.min(product.stock, qty + 1)" class="px-3 py-2 hover:bg-gray-100">+</button>
          </div>
        </div>

        <button
          @click="addToCart"
          :disabled="product.stock === 0"
          class="w-full py-3 rounded-xl font-bold text-lg transition-colors"
          :class="product.stock > 0 ? 'bg-blue-700 hover:bg-blue-600 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'"
        >
          {{ product.stock > 0 ? 'Agregar al carrito' : 'Sin stock' }}
        </button>

        <div v-if="added" class="mt-3 text-green-600 text-sm font-medium text-center">
          Producto agregado al carrito
        </div>
      </div>
    </div>

    <!-- Disponibilidad por ubicacion -->
    <div v-if="locationStock.length" class="mt-12">
      <h2 class="text-xl font-bold text-gray-800 mb-2">Disponibilidad por sucursal</h2>
      <p class="text-gray-500 text-sm mb-6">Haz clic en una sucursal para verla en el mapa</p>

      <div class="grid lg:grid-cols-5 gap-6">
        <!-- Lista de sucursales -->
        <div class="lg:col-span-2 space-y-2">
          <div
            v-for="item in locationStock"
            :key="item.id"
            @click="selectedLocation = item.location.id"
            class="flex items-center gap-3 bg-white rounded-xl p-4 cursor-pointer border-2 transition-all"
            :class="selectedLocation === item.location.id
              ? 'border-blue-600 shadow-md'
              : 'border-transparent shadow-sm hover:border-blue-200'"
          >
            <div
              class="w-3 h-3 rounded-full flex-shrink-0"
              :class="item.stock > 0 ? 'bg-green-500' : 'bg-red-400'"
            />
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-sm text-gray-800">{{ item.location.name }}</p>
              <p class="text-xs text-gray-500 truncate">{{ item.location.address }}, {{ item.location.city }}</p>
            </div>
            <span
              class="text-xs font-bold px-2 py-1 rounded-full flex-shrink-0"
              :class="item.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'"
            >
              {{ item.stock > 0 ? `${item.stock} und.` : 'Agotado' }}
            </span>
          </div>

          <NuxtLink
            to="/tiendas"
            class="block text-center text-sm text-blue-600 hover:underline pt-2"
          >
            Ver todas las tiendas en el mapa
          </NuxtLink>
        </div>

        <!-- Mapa -->
        <div class="lg:col-span-3">
          <ClientOnly>
            <LocationMap
              :locations="mapLocations"
              :height="320"
              :selected="selectedLocation"
              @select="selectedLocation = $event"
            />
            <template #fallback>
              <div class="bg-gray-100 rounded-xl h-80 flex items-center justify-center text-gray-400">
                Cargando mapa...
              </div>
            </template>
          </ClientOnly>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="text-center py-20 text-gray-400">
    <p class="text-5xl mb-4">🔩</p>
    <p>Producto no encontrado</p>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

const route = useRoute()
const cartStore = useCartStore()
const qty = ref(1)
const added = ref(false)
const selectedLocation = ref<number | null>(null)

const { data: product } = await useFetch(`/api/products/${route.params.slug}`)
const { data: locationStockData } = await useFetch(
  () => product.value ? `/api/products/${product.value.id}/locations` : null
)

const locationStock = computed(() => locationStockData.value || [])

const mapLocations = computed(() =>
  locationStock.value.map((item: any) => ({
    id: item.location.id,
    name: item.location.name,
    address: item.location.address,
    city: item.location.city,
    phone: item.location.phone,
    lat: item.location.lat,
    lng: item.location.lng,
    stock: item.stock,
  }))
)

watch(locationStock, (v) => {
  if (v.length && selectedLocation.value === null) {
    selectedLocation.value = v[0].location.id
  }
}, { immediate: true })

const images = computed<string[]>(() => {
  if (!product.value?.images) return []
  try {
    const arr = JSON.parse(product.value.images)
    return Array.isArray(arr) ? arr : [product.value.images]
  } catch {
    return product.value.images ? [product.value.images] : []
  }
})

const activeImage = ref<string | null>(null)
watch(images, (v) => { if (v.length) activeImage.value = v[0] }, { immediate: true })

function formatPrice(n: number) {
  return n.toLocaleString('es-VE', { minimumFractionDigits: 2 })
}

function addToCart() {
  if (!product.value) return
  cartStore.addItem({
    productId: product.value.id,
    name: product.value.name,
    price: Number(product.value.price),
    image: product.value.images || null,
    stock: product.value.stock,
    quantity: qty.value,
  })
  added.value = true
  setTimeout(() => (added.value = false), 2000)
}

useSeoMeta({ title: () => product.value?.name || 'Producto' })
</script>
