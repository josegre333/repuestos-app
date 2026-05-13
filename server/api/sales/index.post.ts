import { prisma } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { customerName, customerPhone, items, notes } = body

  if (!customerName || !items?.length) {
    throw createError({ statusCode: 400, message: 'Nombre del cliente e items son requeridos' })
  }

  // Verify stock and calculate total
  let total = 0
  const saleItems: { productId: number; quantity: number; price: number }[] = []

  for (const item of items) {
    const product = await prisma.product.findUnique({ where: { id: item.productId } })
    if (!product || !product.active) {
      throw createError({ statusCode: 400, message: `Producto ${item.productId} no disponible` })
    }
    if (product.stock < item.quantity) {
      throw createError({ statusCode: 400, message: `Stock insuficiente para ${product.name}` })
    }
    const price = Number(product.price)
    total += price * item.quantity
    saleItems.push({ productId: item.productId, quantity: item.quantity, price })
  }

  const sale = await prisma.$transaction(async (tx) => {
    const newSale = await tx.sale.create({
      data: {
        customerName,
        customerPhone,
        total,
        notes,
        items: { create: saleItems },
      },
      include: { items: { include: { product: { select: { name: true } } } } },
    })

    // Update stock
    for (const item of saleItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      })
    }

    return newSale
  })

  return sale
})
