<template>
  <div class="max-w-3xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Finalizar Compra</h1>

    <div v-if="cartStore.items.length === 0" class="text-center py-16">
      <p class="text-5xl mb-4">🛒</p>
      <p class="text-gray-500 mb-4">El carrito está vacío</p>
      <NuxtLink to="/catalogo" class="text-blue-600 hover:underline">Ver catálogo</NuxtLink>
    </div>

    <div v-else-if="orderDone" class="text-center py-16">
      <p class="text-5xl mb-4">✅</p>
      <h2 class="text-2xl font-bold text-green-700 mb-2">¡Pedido confirmado!</h2>
      <p class="text-gray-600 mb-6">Tu pedido #{{ orderId }} ha sido registrado exitosamente.</p>
      <NuxtLink to="/" class="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600">
        Volver al inicio
      </NuxtLink>
    </div>

    <div v-else class="grid md:grid-cols-5 gap-8">
      <!-- Form -->
      <div class="md:col-span-3">
        <div class="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 class="font-semibold text-lg">Datos de contacto</h2>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
            <input
              v-model="form.customerName"
              type="text"
              class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input
              v-model="form.customerPhone"
              type="tel"
              class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="0412-0000000"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Notas adicionales</label>
            <textarea
              v-model="form.notes"
              rows="3"
              class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Instrucciones especiales, dirección..."
            />
          </div>

          <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>

          <button
            @click="submitOrder"
            :disabled="loading"
            class="w-full bg-blue-700 hover:bg-blue-600 disabled:bg-gray-300 text-white py-3 rounded-xl font-bold transition-colors"
          >
            {{ loading ? 'Procesando...' : 'Confirmar pedido' }}
          </button>
        </div>
      </div>

      <!-- Order summary -->
      <div class="md:col-span-2">
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h2 class="font-semibold text-lg mb-4">Resumen</h2>
          <div class="space-y-3 text-sm">
            <div v-for="item in cartStore.items" :key="item.productId" class="flex justify-between">
              <span class="text-gray-600">{{ item.name }} × {{ item.quantity }}</span>
              <span class="font-medium">${{ formatPrice(item.price * item.quantity) }}</span>
            </div>
          </div>
          <div class="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span class="text-blue-700">${{ formatPrice(cartStore.total) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()
const form = reactive({ customerName: '', customerPhone: '', notes: '' })
const loading = ref(false)
const error = ref('')
const orderDone = ref(false)
const orderId = ref<number | null>(null)

function formatPrice(n: number) {
  return n.toLocaleString('es-VE', { minimumFractionDigits: 2 })
}

async function submitOrder() {
  if (!form.customerName.trim()) {
    error.value = 'El nombre es obligatorio'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const data = await $fetch('/api/sales', {
      method: 'POST',
      body: {
        customerName: form.customerName,
        customerPhone: form.customerPhone || undefined,
        notes: form.notes || undefined,
        items: cartStore.items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      },
    })
    orderId.value = data.id
    orderDone.value = true
    cartStore.clearCart()
  } catch (e: any) {
    error.value = e?.data?.message || 'Error al procesar el pedido'
  } finally {
    loading.value = false
  }
}

useSeoMeta({ title: 'Checkout - Repuestos Auto' })
</script>
