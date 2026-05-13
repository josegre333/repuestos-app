import { requireAuth } from '~~/server/utils/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const form = await readMultipartFormData(event)
  if (!form?.length) throw createError({ statusCode: 400, message: 'No se recibió archivo' })

  const file = form[0]
  if (!file.type?.startsWith('image/')) {
    throw createError({ statusCode: 400, message: 'Solo se permiten imágenes' })
  }

  const ext = file.filename?.split('.').pop() || 'jpg'
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const uploadDir = join(process.cwd(), 'public', 'uploads')

  await mkdir(uploadDir, { recursive: true })
  await writeFile(join(uploadDir, filename), file.data)

  return { url: `/uploads/${filename}` }
})
