import { prisma } from '~~/server/utils/db'

export default defineEventHandler(async () => {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { products: true } } },
  })
})
