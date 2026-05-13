<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Nuestras Tiendas</h1>
      <p class="text-gray-500 mt-1">Encuentra el repuesto que necesitas en la sucursal más cercana</p>
    </div>

    <div v-if="pending" class="bg-gray-200 animate-pulse rounded-xl h-96 mb-6" />

    <div v-else-if="locations.length" class="grid lg:grid-cols-3 gap-6">
      <!-- Mapa -->
      <div class="lg:col-span-2">
        <ClientOnly>
          <LocationMap
            :locations="locations"
            :height="520"
            :selected="selectedId"
            @select="selectedId = $event"
          />
          <template #fallback>
            <div class="bg-gray-100 rounded-xl h-[520px] flex items-center justify-center text-gray-400">
              Cargando mapa...
            </div>
          </template>
        </ClientOnly>
      </div>

      <!-- Lista de sucursales -->
      <div class="space-y-3 overflow-auto max-h-[540px] pr-1">
        <div
          v-for="loc in locations"
          :key="loc.id"
          @click="selectedId = loc.id"
          class="bg-white rounded-xl shadow-sm p-4 cursor-pointer transition-all border-2"
          :class="selectedId === loc.id ? 'border-blue-600 shadow-md' : 'border-transparent hover:border-blue-200'"
        >
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-700 font-bold">
              {{ loc.name.charAt(0) }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-gray-800">{{ loc.name }}</p>
              <p class="text-sm text-gray-500 truncate">{{ loc.address }}</p>
              <p class="text-sm text-gray-500">{{ loc.city }}</p>
              <p v-if="loc.phone" class="text-sm text-blue-600 mt-1">📞 {{ loc.phone }}</p>
              <p class="text-xs text-gray-400 mt-1">{{ loc._count?.productStock || 0 }} productos disponibles</p>
            </div>
          </div>

          <NuxtLink
            :to="`/tiendas/${loc.id}`"
            class="mt-3 block text-center text-sm font-medium bg-blue-50 hover:bg-blue-100 text-blue-700 py-1.5 rounded-lg transition-colors"
          >
            Ver productos en esta tienda
          </NuxtLink>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-20 text-gray-400">
      <p class="text-5xl mb-4">📍</p>
      <p class="text-lg">No hay tiendas registradas aún</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const selectedId = ref<number | null>(null)

const { data, pending } = await useFetch('/api/locations')
const locations = computed(() => data.value || [])

watch(locations, (v) => {
  if (v.length && selectedId.value === null) selectedId.value = v[0].id
}, { immediate: true })

useSeoMeta({ title: 'Nuestras Tiendas - Repuestos Auto' })
</script>
