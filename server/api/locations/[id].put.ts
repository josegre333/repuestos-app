import { requireAuth } from '~~/server/utils/auth'
import { prisma } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const id = parseInt(getRouterParam(event, 'id') || '0')
  const body = await readBody(event)
  const { name, address, city, phone, lat, lng, active } = body

  return prisma.location.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(address && { address }),
      ...(city && { city }),
      ...(phone !== undefined && { phone }),
      ...(lat != null && { lat: parseFloat(lat) }),
      ...(lng != null && { lng: parseFloat(lng) }),
      ...(active !== undefined && { active }),
    },
  })
})
