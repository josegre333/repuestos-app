<template>
  <div class="min-h-screen bg-gray-900 flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <span class="text-5xl">🔧</span>
        <h1 class="text-2xl font-bold text-white mt-3">Repuestos Auto</h1>
        <p class="text-gray-400 mt-1">Panel de Administración</p>
      </div>

      <div class="bg-white rounded-2xl shadow-xl p-8">
        <h2 class="text-xl font-bold text-gray-800 mb-6">Iniciar sesión</h2>

        <form @submit.prevent="login" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@repuestos.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              v-model="form.password"
              type="password"
              required
              class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <p v-if="error" class="text-red-600 text-sm bg-red-50 px-3 py-2 rounded">{{ error }}</p>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-blue-700 hover:bg-blue-600 disabled:bg-gray-300 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            {{ loading ? 'Ingresando...' : 'Ingresar' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: false })

const authStore = useAuthStore()
const router = useRouter()
const form = reactive({ email: '', password: '' })
const loading = ref(false)
const error = ref('')

async function login() {
  loading.value = true
  error.value = ''
  try {
    const data = await $fetch('/api/auth/login', {
      method: 'POST',
      body: form,
    })
    authStore.setUser(data.user)
    router.push('/admin/dashboard')
  } catch (e: any) {
    error.value = e?.data?.message || 'Error al iniciar sesión'
  } finally {
    loading.value = false
  }
}
</script>
