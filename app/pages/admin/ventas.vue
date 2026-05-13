<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Ventas</h1>

    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b">
            <tr class="text-left text-gray-500">
              <th class="px-4 py-3">#</th>
              <th class="px-4 py-3">Cliente</th>
              <th class="px-4 py-3">Teléfono</th>
              <th class="px-4 py-3">Items</th>
              <th class="px-4 py-3">Total</th>
              <th class="px-4 py-3">Estado</th>
              <th class="px-4 py-3">Fecha</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <template v-for="sale in sales" :key="sale.id">
              <tr
                class="hover:bg-gray-50 cursor-pointer"
                @click="expanded === sale.id ? expanded = null : expanded = sale.id"
              >
                <td class="px-4 py-3 font-mono text-gray-400">#{{ sale.id }}</td>
                <td class="px-4 py-3 font-medium">{{ sale.customerName }}</td>
                <td class="px-4 py-3 text-gray-500">{{ sale.customerPhone || '—' }}</td>
                <td class="px-4 py-3 text-gray-500">{{ sale.items.length }} items</td>
                <td class="px-4 py-3 font-semibold text-blue-700">${{ formatPrice(Number(sale.total)) }}</td>
                <td class="px-4 py-3">
                  <select
                    v-model="sale.status"
                    @click.stop
                    @change="updateStatus(sale.id, sale.status)"
                    class="text-xs px-2 py-1 rounded-full border-0 bg-yellow-100 text-yellow-700 font-medium focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="pending">Pendiente</option>
                    <option value="confirmed">Confirmado</option>
                    <option value="completed">Completado</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </td>
                <td class="px-4 py-3 text-gray-500">{{ formatDate(sale.createdAt) }}</td>
              </tr>
              <!-- Expanded items row -->
              <tr v-if="expanded === sale.id">
                <td colspan="7" class="bg-blue-50 px-8 py-3">
                  <p class="font-medium text-sm mb-2">Detalle de la venta:</p>
                  <div class="space-y-1">
                    <div v-for="item in sale.items" :key="item.id" class="flex justify-between text-sm text-gray-700">
                      <span>{{ item.product?.name }} × {{ item.quantity }}</span>
                      <span>${{ formatPrice(Number(item.price) * item.quantity) }}</span>
                    </div>
                  </div>
                  <p v-if="sale.notes" class="mt-2 text-xs text-gray-500">Nota: {{ sale.notes }}</p>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
        <p v-if="!sales.length && !pending" class="text-center text-gray-400 py-12">No hay ventas</p>
        <div v-if="pending" class="py-8 text-center text-gray-400">Cargando...</div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center gap-2 p-4 border-t">
        <button
          v-for="p in totalPages"
          :key="p"
          @click="fetchSales(p)"
          class="px-3 py-1 rounded text-sm font-medium"
          :class="currentPage === p ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
        >{{ p }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'admin' })

const sales = ref<any[]>([])
const totalPages = ref(1)
const currentPage = ref(1)
const pending = ref(false)
const expanded = ref<number | null>(null)

async function fetchSales(page = 1) {
  pending.value = true
  currentPage.value = page
  try {
    const data = await $fetch('/api/sales', { query: { page, limit: 20 } })
    sales.value = data.sales
    totalPages.value = data.totalPages
  } finally {
    pending.value = false
  }
}

async function updateStatus(id: number, status: string) {
  await $fetch(`/api/sales/${id}`, { method: 'PATCH', body: { status } })
}

function formatPrice(n: number) {
  return n.toLocaleString('es-VE', { minimumFractionDigits: 2 })
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('es-VE', { day: '2-digit', month: 'short', year: 'numeric' })
}

await fetchSales()
useSeoMeta({ title: 'Ventas - Admin' })
</script>
