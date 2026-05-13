<template>
  <div class="p-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Ubicaciones / Sucursales</h1>
      <NuxtLink
        to="/admin/ubicaciones/nueva"
        class="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
      >
        + Nueva Ubicación
      </NuxtLink>
    </div>

    <!-- Mapa general -->
    <div class="mb-6 bg-white rounded-xl shadow-sm overflow-hidden">
      <ClientOnly>
        <LocationMap
          :locations="locations"
          :height="320"
          :selected="selectedId"
          @select="selectedId = $event"
        />
        <template #fallback>
          <div class="bg-gray-100 h-80 flex items-center justify-center text-gray-400">Cargando mapa...</div>
        </template>
      </ClientOnly>
    </div>

    <!-- Lista -->
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="loc in locations"
        :key="loc.id"
        class="bg-white rounded-xl shadow-sm p-5 border-2 transition-colors cursor-pointer"
        :class="selectedId === loc.id ? 'border-blue-600' : 'border-transparent'"
        @click="selectedId = loc.id"
      >
        <div class="flex items-start justify-between mb-2">
          <h3 class="font-bold text-gray-800">{{ loc.name }}</h3>
          <span class="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">Activa</span>
        </div>
        <p class="text-sm text-gray-500">{{ loc.address }}</p>
        <p class="text-sm text-gray-500">{{ loc.city }}</p>
        <p v-if="loc.phone" class="text-sm text-blue-600 mt-1">📞 {{ loc.phone }}</p>
        <p class="text-xs text-gray-400 mt-2">
          📍 {{ loc.lat.toFixed(5) }}, {{ loc.lng.toFixed(5) }}
        </p>

        <div class="flex gap-2 mt-4">
          <NuxtLink
            :to="`/admin/ubicaciones/${loc.id}`"
            class="flex-1 text-center text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 py-1.5 rounded-lg font-medium"
          >
            Editar
          </NuxtLink>
          <NuxtLink
            :to="`/admin/ubicaciones/${loc.id}/stock`"
            class="flex-1 text-center text-sm bg-gray-50 hover:bg-gray-100 text-gray-700 py-1.5 rounded-lg font-medium"
          >
            Gestionar stock
          </NuxtLink>
          <button
            @click.stop="deleteLocation(loc.id)"
            class="text-red-400 hover:text-red-600 text-sm px-2"
          >
            🗑
          </button>
        </div>
      </div>

      <p v-if="!locations.length" class="col-span-3 text-center text-gray-400 py-12">
        No hay ubicaciones registradas
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'admin' })

const selectedId = ref<number | null>(null)
const { data, refresh } = await useFetch('/api/locations')
const locations = computed(() => data.value || [])

watch(locations, (v) => { if (v.length && !selectedId.value) selectedId.value = v[0].id }, { immediate: true })

async function deleteLocation(id: number) {
  if (!confirm('¿Desactivar esta ubicación?')) return
  await $fetch(`/api/locations/${id}`, { method: 'DELETE' })
  refresh()
}

useSeoMeta({ title: 'Ubicaciones - Admin' })
</script>
