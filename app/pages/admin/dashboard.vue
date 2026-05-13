<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold text-gray-800 mb-8">Dashboard</h1>

    <!-- Stats cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <div class="bg-white rounded-xl shadow-sm p-6">
        <p class="text-sm text-gray-500">Total Productos</p>
        <p class="text-3xl font-bold text-blue-700 mt-1">{{ stats.totalProducts }}</p>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-6">
        <p class="text-sm text-gray-500">En Stock</p>
        <p class="text-3xl font-bold text-green-600 mt-1">{{ stats.inStock }}</p>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-6">
        <p class="text-sm text-gray-500">Sin Stock</p>
        <p class="text-3xl font-bold text-red-500 mt-1">{{ stats.outOfStock }}</p>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-6">
        <p class="text-sm text-gray-500">Ventas Totales</p>
        <p class="text-3xl font-bold text-purple-600 mt-1">{{ stats.totalSales }}</p>
      </div>
    </div>

    <!-- Recent sales -->
    <div class="bg-white rounded-xl shadow-sm p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-semibold text-lg">Ventas Recientes</h2>
        <NuxtLink to="/admin/ventas" class="text-sm text-blue-600 hover:underline">Ver todas</NuxtLink>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b text-left text-gray-500">
              <th class="pb-3 pr-4">#</th>
              <th class="pb-3 pr-4">Cliente</th>
              <th class="pb-3 pr-4">Total</th>
              <th class="pb-3 pr-4">Estado</th>
              <th class="pb-3">Fecha</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr v-for="sale in recentSales" :key="sale.id">
              <td class="py-3 pr-4 font-mono text-gray-400">#{{ sale.id }}</td>
              <td class="py-3 pr-4 font-medium">{{ sale.customerName }}</td>
              <td class="py-3 pr-4 text-blue-700 font-semibold">${{ formatPrice(Number(sale.total)) }}</td>
              <td class="py-3 pr-4">
                <span class="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                  {{ sale.status }}
                </span>
              </td>
              <td class="py-3 text-gray-500">{{ formatDate(sale.createdAt) }}</td>
            </tr>
          </tbody>
        </table>
        <p v-if="!recentSales.length" class="text-center text-gray-400 py-8">No hay ventas aún</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'admin' })

const { data: productsData } = await useFetch('/api/products', { query: { limit: 1000 } })
const { data: salesData } = await useFetch('/api/sales', { query: { limit: 5 } })

const stats = computed(() => {
  const products = productsData.value?.products || []
  return {
    totalProducts: productsData.value?.total || 0,
    inStock: products.filter((p: any) => p.stock > 0).length,
    outOfStock: products.filter((p: any) => p.stock === 0).length,
    totalSales: salesData.value?.total || 0,
  }
})

const recentSales = computed(() => salesData.value?.sales || [])

function formatPrice(n: number) {
  return n.toLocaleString('es-VE', { minimumFractionDigits: 2 })
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('es-VE', { day: '2-digit', month: 'short', year: 'numeric' })
}

useSeoMeta({ title: 'Dashboard - Admin' })
</script>
