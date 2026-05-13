<template>
  <form @submit.prevent="$emit('submit', form)" class="space-y-5">
    <div class="grid md:grid-cols-2 gap-5">
      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-gray-700 mb-1">Nombre de la sucursal *</label>
        <input
          v-model="form.name"
          type="text"
          required
          class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="ej. Sucursal Centro"
        />
      </div>

      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-gray-700 mb-1">Dirección *</label>
        <input
          v-model="form.address"
          type="text"
          required
          class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="ej. Av. Principal, Local 5"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Ciudad *</label>
        <input
          v-model="form.city"
          type="text"
          required
          class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="ej. Caracas"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
        <input
          v-model="form.phone"
          type="tel"
          class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="0212-0000000"
        />
      </div>

      <!-- Coordenadas -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Latitud *</label>
        <input
          v-model="form.lat"
          type="number"
          step="any"
          required
          class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="ej. 10.48801"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Longitud *</label>
        <input
          v-model="form.lng"
          type="number"
          step="any"
          required
          class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="ej. -66.87919"
        />
      </div>
    </div>

    <!-- Mini mapa de preview -->
    <div v-if="hasCoords">
      <p class="text-sm font-medium text-gray-700 mb-2">Vista previa en mapa</p>
      <ClientOnly>
        <LocationMap
          :locations="[{ id: 0, name: form.name || 'Nueva ubicación', address: form.address, city: form.city, lat: Number(form.lat), lng: Number(form.lng) }]"
          :height="240"
        />
        <template #fallback>
          <div class="bg-gray-100 rounded-xl h-60 flex items-center justify-center text-gray-400">Cargando...</div>
        </template>
      </ClientOnly>
      <p class="text-xs text-gray-400 mt-2">
        Tip: Puedes obtener las coordenadas haciendo clic derecho en
        <a href="https://maps.google.com" target="_blank" class="text-blue-500 hover:underline">Google Maps</a>
        o
        <a href="https://www.openstreetmap.org" target="_blank" class="text-blue-500 hover:underline">OpenStreetMap</a>.
      </p>
    </div>

    <div class="flex gap-3 pt-2">
      <button
        type="submit"
        :disabled="loading"
        class="bg-blue-700 hover:bg-blue-600 disabled:bg-gray-300 text-white px-6 py-2.5 rounded-lg font-semibold"
      >
        {{ loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear ubicación') }}
      </button>
      <NuxtLink to="/admin/ubicaciones" class="px-6 py-2.5 border rounded-lg text-gray-600 hover:bg-gray-50 text-sm font-medium">
        Cancelar
      </NuxtLink>
    </div>
  </form>
</template>

<script setup lang="ts">
const props = defineProps<{
  initial?: Record<string, any>
  loading?: boolean
  isEdit?: boolean
}>()

defineEmits<{ submit: [data: Record<string, any>] }>()

const form = reactive({
  name: props.initial?.name || '',
  address: props.initial?.address || '',
  city: props.initial?.city || '',
  phone: props.initial?.phone || '',
  lat: props.initial?.lat ?? '',
  lng: props.initial?.lng ?? '',
})

const hasCoords = computed(() => form.lat !== '' && form.lng !== '' && !isNaN(Number(form.lat)) && !isNaN(Number(form.lng)))
</script>
