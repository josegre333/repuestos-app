import { requireAuth } from '~~/server/utils/auth'
import { prisma } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const query = getQuery(event)
  const { page = 1, limit = 20 } = query
  const skip = (Number(page) - 1) * Number(limit)

  const [sales, total] = await Promise.all([
    prisma.sale.findMany({
      include: {
        items: {
          include: { product: { select: { name: true, sku: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit),
    }),
    prisma.sale.count(),
  ])

  return { sales, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) }
})
