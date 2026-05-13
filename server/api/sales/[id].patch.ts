import { requireAuth } from '~~/server/utils/auth'
import { prisma } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const id = parseInt(getRouterParam(event, 'id') || '0')
  const body = await readBody(event)
  return prisma.sale.update({ where: { id }, data: { status: body.status } })
})
