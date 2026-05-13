import { prisma } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const isNumeric = /^\d+$/.test(id || '')

  const product = await prisma.product.findFirst({
    where: isNumeric ? { id: parseInt(id!) } : { slug: id! },
    select: { id: true },
  })

  if (!product) throw createError({ statusCode: 404, message: 'Producto no encontrado' })

  return prisma.productLocation.findMany({
    where: { productId: product.id },
    include: {
      location: true,
    },
    orderBy: { location: { name: 'asc' } },
  })
})
