<template>
  <div ref="mapContainer" class="w-full rounded-xl overflow-hidden" :style="{ height: height + 'px' }" />
</template>

<script setup lang="ts">
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface MapLocation {
  id: number
  name: string
  address: string
  city: string
  phone?: string | null
  lat: number
  lng: number
  stock?: number
}

const props = withDefaults(defineProps<{
  locations: MapLocation[]
  height?: number
  selected?: number | null
}>(), {
  height: 400,
  selected: null,
})

const emit = defineEmits<{ select: [id: number] }>()

const mapContainer = ref<HTMLDivElement | null>(null)
let map: L.Map | null = null
const markers = new Map<number, L.Marker>()

function buildIcon(inStock: boolean, isSelected: boolean) {
  const color = isSelected ? '#1d4ed8' : inStock ? '#16a34a' : '#dc2626'
  return L.divIcon({
    className: '',
    html: `<div style="
      width:32px;height:32px;border-radius:50% 50% 50% 0;
      background:${color};border:3px solid white;
      box-shadow:0 2px 6px rgba(0,0,0,0.4);
      transform:rotate(-45deg);
    "></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -34],
  })
}

function buildPopup(loc: MapLocation) {
  const stockHtml = loc.stock !== undefined
    ? `<div style="margin-top:6px;font-size:12px;font-weight:600;color:${(loc.stock ?? 0) > 0 ? '#16a34a' : '#dc2626'}">
        ${(loc.stock ?? 0) > 0 ? `✓ ${loc.stock} en stock` : '✗ Sin stock'}
      </div>`
    : ''
  return `
    <div style="min-width:160px;font-family:sans-serif">
      <p style="font-weight:700;font-size:14px;margin:0 0 4px">${loc.name}</p>
      <p style="font-size:12px;color:#555;margin:0">${loc.address}</p>
      <p style="font-size:12px;color:#555;margin:0">${loc.city}</p>
      ${loc.phone ? `<p style="font-size:12px;color:#3b82f6;margin:4px 0 0">📞 ${loc.phone}</p>` : ''}
      ${stockHtml}
    </div>
  `
}

function initMap() {
  if (!mapContainer.value || !props.locations.length) return

  const center = props.locations[0]
  map = L.map(mapContainer.value).setView([center.lat, center.lng], 13)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map)

  addMarkers()

  if (props.locations.length > 1) {
    const bounds = L.latLngBounds(props.locations.map((l) => [l.lat, l.lng]))
    map.fitBounds(bounds, { padding: [40, 40] })
  }
}

function addMarkers() {
  if (!map) return
  markers.forEach((m) => m.remove())
  markers.clear()

  for (const loc of props.locations) {
    const inStock = loc.stock === undefined || (loc.stock ?? 0) > 0
    const isSelected = props.selected === loc.id
    const marker = L.marker([loc.lat, loc.lng], { icon: buildIcon(inStock, isSelected) })
      .addTo(map!)
      .bindPopup(buildPopup(loc))
      .on('click', () => emit('select', loc.id))

    if (isSelected) marker.openPopup()
    markers.set(loc.id, marker)
  }
}

onMounted(() => {
  nextTick(() => initMap())
})

onUnmounted(() => {
  map?.remove()
  map = null
})

watch(() => props.locations, () => {
  if (!map) { nextTick(() => initMap()); return }
  addMarkers()
  if (props.locations.length > 1) {
    const bounds = L.latLngBounds(props.locations.map((l) => [l.lat, l.lng]))
    map.fitBounds(bounds, { padding: [40, 40] })
  }
}, { deep: true })

watch(() => props.selected, (newId) => {
  if (!map || newId == null) return
  const loc = props.locations.find((l) => l.id === newId)
  if (!loc) return
  map.setView([loc.lat, loc.lng], 15, { animate: true })
  markers.get(newId)?.openPopup()
  addMarkers()
})
</script>
