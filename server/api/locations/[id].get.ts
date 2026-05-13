import { prisma } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const id = parseInt(getRouterParam(event, 'id') || '0')

  const location = await prisma.location.findUnique({
    where: { id },
    include: {
      productStock: {
        include: {
          product: {
            select: { id: true, name: true, slug: true, price: true, images: true, sku: true },
          },
        },
        where: { stock: { gt: 0 } },
        orderBy: { stock: 'desc' },
      },
    },
  })

  if (!location) throw createError({ statusCode: 404, message: 'Ubicación no encontrada' })
  return location
})
