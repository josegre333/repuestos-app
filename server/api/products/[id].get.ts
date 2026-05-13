import { prisma } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const isNumeric = /^\d+$/.test(id || '')

  const product = await prisma.product.findFirst({
    where: isNumeric ? { id: parseInt(id!), active: true } : { slug: id!, active: true },
    include: { category: { select: { name: true, slug: true } } },
  })

  if (!product) throw createError({ statusCode: 404, message: 'Producto no encontrado' })
  return product
})
