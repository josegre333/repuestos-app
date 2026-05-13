<template>
  <div class="p-8 max-w-3xl">
    <div class="flex items-center gap-3 mb-6">
      <NuxtLink to="/admin/ubicaciones" class="text-gray-400 hover:text-gray-600">← Volver</NuxtLink>
      <h1 class="text-2xl font-bold text-gray-800">Nueva Ubicación</h1>
    </div>

    <div class="bg-white rounded-xl shadow-sm p-6">
      <p v-if="error" class="text-red-600 text-sm bg-red-50 px-3 py-2 rounded mb-4">{{ error }}</p>
      <AdminLocationForm :loading="loading" @submit="create" />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'admin' })

const loading = ref(false)
const error = ref('')
const router = useRouter()

async function create(form: Record<string, any>) {
  loading.value = true
  error.value = ''
  try {
    await $fetch('/api/locations', { method: 'POST', body: form })
    router.push('/admin/ubicaciones')
  } catch (e: any) {
    error.value = e?.data?.message || 'Error al crear la ubicación'
  } finally {
    loading.value = false
  }
}

useSeoMeta({ title: 'Nueva Ubicación - Admin' })
</script>
