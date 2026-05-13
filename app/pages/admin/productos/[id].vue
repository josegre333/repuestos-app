<template>
  <div class="p-8 max-w-3xl">
    <div class="flex items-center gap-3 mb-6">
      <NuxtLink to="/admin/productos" class="text-gray-400 hover:text-gray-600">← Volver</NuxtLink>
      <h1 class="text-2xl font-bold text-gray-800">Editar Producto</h1>
    </div>

    <div v-if="product" class="bg-white rounded-xl shadow-sm p-6">
      <p v-if="error" class="text-red-600 text-sm bg-red-50 px-3 py-2 rounded mb-4">{{ error }}</p>
      <AdminProductForm
        :initial="product"
        :categories="categories"
        :loading="loading"
        :is-edit="true"
        @submit="updateProduct"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'admin' })

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const error = ref('')

const { data: product } = await useFetch(`/api/products/${route.params.id}`)
const { data: categoriesData } = await useFetch('/api/categories')
const categories = computed(() => categoriesData.value || [])

async function updateProduct(form: Record<string, any>) {
  loading.value = true
  error.value = ''
  try {
    await $fetch(`/api/products/${route.params.id}`, { method: 'PUT', body: form })
    router.push('/admin/productos')
  } catch (e: any) {
    error.value = e?.data?.message || 'Error al actualizar el producto'
  } finally {
    loading.value = false
  }
}

useSeoMeta({ title: 'Editar Producto - Admin' })
</script>
