<template>
  <div class="min-h-screen bg-gray-100 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-gray-900 text-white flex flex-col">
      <div class="p-4 border-b border-gray-700">
        <NuxtLink to="/" class="flex items-center gap-2">
          <span class="text-xl">🔧</span>
          <div>
            <p class="font-bold text-sm">Repuestos Auto</p>
            <p class="text-gray-400 text-xs">Panel Admin</p>
          </div>
        </NuxtLink>
      </div>

      <nav class="flex-1 p-4 space-y-1">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="$route.path.startsWith(item.to) ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'"
        >
          <span>{{ item.icon }}</span>
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="p-4 border-t border-gray-700">
        <p class="text-gray-400 text-xs mb-2">{{ authStore.user?.name }}</p>
        <button
          @click="logout"
          class="w-full text-left text-sm text-red-400 hover:text-red-300 transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>

    <!-- Content -->
    <div class="flex-1 overflow-auto">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const navItems = [
  { to: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/admin/productos', icon: '🔩', label: 'Productos' },
  { to: '/admin/categorias', icon: '📁', label: 'Categorías' },
  { to: '/admin/ubicaciones', icon: '📍', label: 'Ubicaciones' },
  { to: '/admin/ventas', icon: '🛒', label: 'Ventas' },
]

async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST' })
  authStore.clearUser()
  router.push('/admin/login')
}
</script>
