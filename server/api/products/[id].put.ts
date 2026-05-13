import { requireAuth } from '~~/server/utils/auth'
import { prisma } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const id = parseInt(getRouterParam(event, 'id') || '0')
  const body = await readBody(event)
  const { name, description, price, stock, sku, images, categoryId, active } = body

  return prisma.product.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price: parseFloat(price) }),
      ...(stock !== undefined && { stock: parseInt(stock) }),
      ...(sku !== undefined && { sku }),
      ...(images !== undefined && { images: Array.isArray(images) ? JSON.stringify(images) : images }),
      ...(categoryId && { categoryId: parseInt(categoryId) }),
      ...(active !== undefined && { active }),
    },
    include: { category: { select: { name: true, slug: true } } },
  })
})
