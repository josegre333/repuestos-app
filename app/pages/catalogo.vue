<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-2">Catálogo de Repuestos</h1>
    <p class="text-gray-500 mb-8">{{ total }} productos encontrados</p>

    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Filters sidebar -->
      <aside class="lg:w-64 flex-shrink-0">
        <div class="bg-white rounded-xl shadow-sm p-5 space-y-5 sticky top-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
            <input
              v-model="filters.search"
              @input="debouncedFetch"
              type="text"
              placeholder="Nombre, SKU..."
              class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
            <select
              v-model="filters.category"
              @change="fetchProducts(1)"
              class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Todas</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.slug">{{ cat.name }}</option>
            </select>
          </div>

          <label class="flex items-center gap-2 cursor-pointer">
            <input v-model="filters.inStock" @change="fetchProducts(1)" type="checkbox" class="rounded text-blue-600" />
            <span class="text-sm text-gray-700">Solo en stock</span>
          </label>

          <button @click="clearFilters" class="text-sm text-blue-600 hover:underline">Limpiar filtros</button>
        </div>
      </aside>

      <!-- Products grid -->
      <div class="flex-1">
        <div v-if="pending" class="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div v-for="n in 9" :key="n" class="bg-gray-200 animate-pulse rounded-xl h-72" />
        </div>

        <div v-else-if="!products.length" class="text-center py-20 text-gray-400">
          <p class="text-5xl mb-4">🔍</p>
          <p class="text-lg">No se encontraron productos</p>
        </div>

        <template v-else>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
            <ProductCard v-for="p in products" :key="p.id" :product="p" />
          </div>

          <!-- Pagination -->
          <div class="flex justify-center gap-2 mt-8">
            <button
              v-for="p in totalPages"
              :key="p"
              @click="fetchProducts(p)"
              class="px-3 py-1 rounded text-sm font-medium transition-colors"
              :class="currentPage === p ? 'bg-blue-700 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'"
            >{{ p }}</button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const filters = reactive({
  search: (route.query.buscar as string) || '',
  category: (route.query.categoria as string) || '',
  inStock: false,
})

const products = ref<any[]>([])
const total = ref(0)
const totalPages = ref(1)
const currentPage = ref(1)
const pending = ref(false)

const { data: categoriesData } = await useFetch('/api/categories')
const categories = computed(() => categoriesData.value || [])

async function fetchProducts(page = 1) {
  pending.value = true
  currentPage.value = page
  try {
    const data = await $fetch('/api/products', {
      query: {
        page,
        limit: 12,
        search: filters.search || undefined,
        category: filters.category || undefined,
        inStock: filters.inStock ? 'true' : undefined,
      },
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

function clearFilters() {
  filters.search = ''
  filters.category = ''
  filters.inStock = false
  fetchProducts(1)
}

await fetchProducts(1)
useSeoMeta({ title: 'Catálogo - Repuestos Auto' })
</script>
