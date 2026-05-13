import { PrismaClient } from '../app/generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)

  await prisma.user.upsert({
    where: { email: 'admin@repuestos.com' },
    update: {},
    create: {
      email: 'admin@repuestos.com',
      password: hashedPassword,
      name: 'Administrador',
      role: 'admin',
    },
  })

  const categories = [
    { name: 'Motor', slug: 'motor' },
    { name: 'Frenos', slug: 'frenos' },
    { name: 'Suspensión', slug: 'suspension' },
    { name: 'Eléctrico', slug: 'electrico' },
    { name: 'Transmisión', slug: 'transmision' },
    { name: 'Carrocería', slug: 'carroceria' },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }

  // Ubicaciones de ejemplo (Caracas, Venezuela)
  const locations = [
    {
      name: 'Sucursal Centro',
      address: 'Av. Urdaneta, Torre Este, PB',
      city: 'Caracas',
      phone: '0212-555-0001',
      lat: 10.48801,
      lng: -66.87919,
    },
    {
      name: 'Sucursal Chacao',
      address: 'Av. Francisco de Miranda, C.C. Líder',
      city: 'Caracas',
      phone: '0212-555-0002',
      lat: 10.49422,
      lng: -66.84618,
    },
    {
      name: 'Sucursal Maracay',
      address: 'Av. Las Delicias, Local 12',
      city: 'Maracay',
      phone: '0243-555-0003',
      lat: 10.24629,
      lng: -67.59563,
    },
  ]

  for (const loc of locations) {
    const existing = await prisma.location.findFirst({ where: { name: loc.name } })
    if (!existing) {
      await prisma.location.create({ data: loc })
    }
  }

  console.log('Seed completado.')
  console.log('Admin: admin@repuestos.com / admin123')
  console.log('3 sucursales de ejemplo creadas (Caracas x2, Maracay)')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
