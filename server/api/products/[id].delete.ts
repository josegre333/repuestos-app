import { requireAuth } from '~~/server/utils/auth'
import { prisma } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const id = parseInt(getRouterParam(event, 'id') || '0')
  await prisma.product.update({ where: { id }, data: { active: false } })
  return { ok: true }
})
