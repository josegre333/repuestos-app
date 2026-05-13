import { prisma } from '~~/server/utils/db'

export default defineEventHandler(async () => {
  return prisma.location.findMany({
    where: { active: true },
    orderBy: { name: 'asc' },
    include: {
      _count: { select: { productStock: true } },
    },
  })
})
