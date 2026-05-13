<template>
  <form @submit.prevent="$emit('submit', form)" class="space-y-5">
    <div class="grid md:grid-cols-2 gap-5">
      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
        <input
          v-model="form.name"
          type="text"
          required
          class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
        <select
          v-model="form.categoryId"
          required
          class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Seleccionar...</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">SKU</label>
        <input
          v-model="form.sku"
          type="text"
          class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="ej. ENG-001"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Precio *</label>
        <input
          v-model="form.price"
          type="number"
          step="0.01"
          min="0"
          required
          class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Stock</label>
        <input
          v-model="form.stock"
          type="number"
          min="0"
          class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
        <textarea
          v-model="form.description"
          rows="3"
          class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <!-- Image upload -->
      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-gray-700 mb-1">Imágenes</label>
        <input
          type="file"
          accept="image/*"
          multiple
          @change="uploadImages"
          class="block text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <div v-if="imageUrls.length" class="flex flex-wrap gap-2 mt-3">
          <div v-for="(url, i) in imageUrls" :key="i" class="relative">
            <img :src="url" class="w-20 h-20 object-cover rounded-lg" />
            <button
              type="button"
              @click="removeImage(i)"
              class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
            >✕</button>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <input v-model="form.active" type="checkbox" id="active" class="rounded text-blue-600" />
        <label for="active" class="text-sm text-gray-700">Producto activo</label>
      </div>
    </div>

    <div class="flex gap-3 pt-2">
      <button
        type="submit"
        :disabled="loading"
        class="bg-blue-700 hover:bg-blue-600 disabled:bg-gray-300 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors"
      >
        {{ loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear producto') }}
      </button>
      <NuxtLink to="/admin/productos" class="px-6 py-2.5 border rounded-lg text-gray-600 hover:bg-gray-50 text-sm font-medium">
        Cancelar
      </NuxtLink>
    </div>
  </form>
</template>

<script setup lang="ts">
const props = defineProps<{
  initial?: Record<string, any>
  categories: Array<{ id: number; name: string }>
  loading?: boolean
  isEdit?: boolean
}>()

const emit = defineEmits<{ submit: [data: Record<string, any>] }>()

const form = reactive({
  name: props.initial?.name || '',
  categoryId: props.initial?.categoryId || '',
  sku: props.initial?.sku || '',
  price: props.initial?.price || '',
  stock: props.initial?.stock ?? 0,
  description: props.initial?.description || '',
  images: props.initial?.images || '',
  active: props.initial?.active ?? true,
})

const imageUrls = ref<string[]>(
  props.initial?.images ? (() => {
    try { return JSON.parse(props.initial.images) } catch { return [props.initial.images] }
  })() : []
)

async function uploadImages(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (!files?.length) return
  for (const file of Array.from(files)) {
    const fd = new FormData()
    fd.append('file', file)
    const res = await $fetch<{ url: string }>('/api/upload', { method: 'POST', body: fd })
    imageUrls.value.push(res.url)
  }
  form.images = JSON.stringify(imageUrls.value)
}

function removeImage(i: number) {
  imageUrls.value.splice(i, 1)
  form.images = JSON.stringify(imageUrls.value)
}
</script>
