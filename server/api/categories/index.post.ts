import { requireAuth } from '~~/server/utils/auth'
import { prisma } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const body = await readBody(event)
  const { name, image } = body

  if (!name) throw createError({ statusCode: 400, message: 'Nombre es requerido' })

  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  return prisma.category.create({ data: { name, slug, image } })
})
