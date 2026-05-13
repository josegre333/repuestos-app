import { requireAuth } from '~~/server/utils/auth'
import { prisma } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const body = await readBody(event)
  const { name, description, price, stock, sku, images, categoryId, active } = body

  if (!name || !price || !categoryId) {
    throw createError({ statusCode: 400, message: 'Nombre, precio y categoría son requeridos' })
  }

  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now()

  return prisma.product.create({
    data: {
      name,
      slug,
      description,
      price: parseFloat(price),
      stock: parseInt(stock || 0),
      sku,
      images: Array.isArray(images) ? JSON.stringify(images) : images,
      categoryId: parseInt(categoryId),
      active: active !== false,
    },
    include: { category: { select: { name: true, slug: true } } },
  })
})
