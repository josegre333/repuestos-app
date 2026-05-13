<template>
  <div>
    <!-- Hero -->
    <section class="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Repuestos para tu Vehículo</h1>
        <p class="text-xl text-blue-200 mb-8">Catálogo completo de repuestos originales y alternativos</p>
        <div class="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
          <input
            v-model="search"
            @keyup.enter="goToSearch"
            type="text"
            placeholder="Buscar repuesto, SKU..."
            class="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            @click="goToSearch"
            class="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold px-6 py-3 rounded-lg transition-colors"
          >
            Buscar
          </button>
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section class="max-w-7xl mx-auto px-4 py-12">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Categorías</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        <NuxtLink
          v-for="cat in categories"
          :key="cat.id"
          :to="`/catalogo?categoria=${cat.slug}`"
          class="flex flex-col items-center gap-2 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow text-center group"
        >
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl group-hover:bg-blue-200 transition-colors">
            {{ categoryIcon(cat.name) }}
          </div>
          <span class="text-sm font-medium text-gray-700">{{ cat.name }}</span>
          <span class="text-xs text-gray-400">{{ cat._count?.products || 0 }} items</span>
        </NuxtLink>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="max-w-7xl mx-auto px-4 pb-12">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Productos Recientes</h2>
        <NuxtLink to="/catalogo" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
          Ver todo el catálogo →
        </NuxtLink>
      </div>

      <div v-if="pending" class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div v-for="n in 8" :key="n" class="bg-gray-200 animate-pulse rounded-xl h-72" />
      </div>

      <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <ProductCard v-for="p in products" :key="p.id" :product="p" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const search = ref('')
const router = useRouter()

const { data: categoriesData } = await useFetch('/api/categories')
const categories = computed(() => categoriesData.value || [])

const { data: productsData, pending } = await useFetch('/api/products', {
  query: { limit: 8 },
})
const products = computed(() => productsData.value?.products || [])

function goToSearch() {
  if (search.value.trim()) {
    router.push(`/catalogo?buscar=${encodeURIComponent(search.value)}`)
  }
}

const icons: Record<string, string> = {
  motor: '⚙️', frenos: '🛑', suspensión: '🔧', suspension: '🔧',
  eléctrico: '⚡', electrico: '⚡', transmisión: '⚙️', transmision: '⚙️',
  carrocería: '🚗', carroceria: '🚗',
}

function categoryIcon(name: string) {
  return icons[name.toLowerCase()] || '🔩'
}

useSeoMeta({ title: 'Repuestos Auto - Catálogo de Repuestos' })
</script>
