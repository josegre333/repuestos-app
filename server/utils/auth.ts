import type { H3Event } from 'h3'
import { verifyToken } from './jwt'

export async function requireAuth(event: H3Event) {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'auth_token') || getHeader(event, 'authorization')?.replace('Bearer ', '')

  if (!token) {
    throw createError({ statusCode: 401, message: 'No autorizado' })
  }

  try {
    const payload = await verifyToken(token, config.jwtSecret)
    return payload
  } catch {
    throw createError({ statusCode: 401, message: 'Token inválido o expirado' })
  }
}
