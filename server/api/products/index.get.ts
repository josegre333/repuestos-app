import { prisma } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { category, search, page = 1, limit = 12, inStock } = query

  const where: Record<string, unknown> = { active: true }

  if (category) {
    where.category = { slug: category }
  }
  if (search) {
    where.OR = [
      { name: { contains: search as string } },
      { sku: { contains: search as string } },
      { description: { contains: search as string } },
    ]
  }
  if (inStock === 'true') {
    where.stock = { gt: 0 }
  }

  const skip = (Number(page) - 1) * Number(limit)
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: { select: { name: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit),
    }),
    prisma.product.count({ where }),
  ])

  return {
    products,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit)),
  }
})
