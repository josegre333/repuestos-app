import { requireAuth } from '~~/server/utils/auth'
import { prisma } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const body = await readBody(event)
  const { name, address, city, phone, lat, lng } = body

  if (!name || !address || !city || lat == null || lng == null) {
    throw createError({ statusCode: 400, message: 'Nombre, dirección, ciudad y coordenadas son requeridos' })
  }

  return prisma.location.create({
    data: {
      name,
      address,
      city,
      phone: phone || null,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    },
  })
})
