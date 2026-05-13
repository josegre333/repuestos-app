import { requireAuth } from '~~/server/utils/auth'
import { prisma } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const payload = await requireAuth(event)
  const user = await prisma.user.findUnique({
    where: { id: payload.userId as number },
    select: { id: true, email: true, name: true, role: true },
  })
  if (!user) throw createError({ statusCode: 404, message: 'Usuario no encontrado' })
  return user
})
