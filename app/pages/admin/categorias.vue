<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Categorías</h1>

    <div class="grid md:grid-cols-2 gap-8">
      <!-- Form -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h2 class="font-semibold text-lg mb-4">Nueva Categoría</h2>
        <form @submit.prevent="createCategory" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="ej. Motor"
            />
          </div>
          <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>
          <button
            type="submit"
            :disabled="loading"
            class="bg-blue-700 hover:bg-blue-600 disabled:bg-gray-300 text-white px-5 py-2 rounded-lg font-semibold"
          >
            {{ loading ? 'Guardando...' : 'Crear categoría' }}
          </button>
        </form>
      </div>

      <!-- List -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h2 class="font-semibold text-lg mb-4">Categorías existentes</h2>
        <div class="space-y-2">
          <div
            v-for="cat in categories"
            :key="cat.id"
            class="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg"
          >
            <div>
              <p class="font-medium text-sm">{{ cat.name }}</p>
              <p class="text-xs text-gray-400">{{ cat._count?.products || 0 }} productos</p>
            </div>
            <button
              @click="deleteCategory(cat.id)"
              class="text-red-400 hover:text-red-600 text-sm"
              :disabled="(cat._count?.products || 0) > 0"
              :title="(cat._count?.products || 0) > 0 ? 'Tiene productos asignados' : 'Eliminar'"
            >
              🗑
            </button>
          </div>
          <p v-if="!categories.length" class="text-gray-400 text-sm text-center py-4">Sin categorías</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'admin' })

const form = reactive({ name: '' })
const loading = ref(false)
const error = ref('')

const { data: categoriesData, refresh } = await useFetch('/api/categories')
const categories = computed(() => categoriesData.value || [])

async function createCategory() {
  loading.value = true
  error.value = ''
  try {
    await $fetch('/api/categories', { method: 'POST', body: form })
    form.name = ''
    refresh()
  } catch (e: any) {
    error.value = e?.data?.message || 'Error al crear categoría'
  } finally {
    loading.value = false
  }
}

async function deleteCategory(id: number) {
  if (!confirm('¿Eliminar esta categoría?')) return
  await $fetch(`/api/categories/${id}`, { method: 'DELETE' })
  refresh()
}

useSeoMeta({ title: 'Categorías - Admin' })
</script>
