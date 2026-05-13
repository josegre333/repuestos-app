import { requireAuth } from '~~/server/utils/auth'
import { prisma } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const id = parseInt(getRouterParam(event, 'id') || '0')
  const body = await readBody(event)
  const { locations } = body as { locations: Array<{ locationId: number; stock: number }> }

  if (!Array.isArray(locations)) {
    throw createError({ statusCode: 400, message: 'Se esperaba un array de ubicaciones' })
  }

  // Upsert each location stock
  const results = await Promise.all(
    locations.map((item) =>
      prisma.productLocation.upsert({
        where: { productId_locationId: { productId: id, locationId: item.locationId } },
        update: { stock: item.stock },
        create: { productId: id, locationId: item.locationId, stock: item.stock },
      })
    )
  )

  // Sync total stock on product
  const totalStock = locations.reduce((sum, i) => sum + (i.stock || 0), 0)
  await prisma.product.update({ where: { id }, data: { stock: totalStock } })

  return results
})
