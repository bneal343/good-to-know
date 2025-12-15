import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create service components
  const bookkeeping = await prisma.serviceComponent.create({
    data: {
      name: 'Monthly Bookkeeping',
      description: 'Complete monthly bookkeeping including transaction categorization, reconciliation, and financial statement preparation.',
      estimatedHours: 8,
      billableRate: 75,
      price: 600,
      photoUrl: null,
    },
  })

  const taxPrep = await prisma.serviceComponent.create({
    data: {
      name: 'Tax Preparation',
      description: 'Federal and state tax return preparation for individuals or businesses.',
      estimatedHours: 12,
      billableRate: 100,
      price: 1200,
      photoUrl: null,
    },
  })

  const payroll = await prisma.serviceComponent.create({
    data: {
      name: 'Payroll Processing',
      description: 'Complete payroll processing including wage calculations, tax withholdings, and direct deposits.',
      estimatedHours: 4,
      billableRate: 80,
      price: 320,
      photoUrl: null,
    },
  })

  const consultation = await prisma.serviceComponent.create({
    data: {
      name: 'Financial Consultation',
      description: 'One-hour consultation to review financial health and discuss strategic planning.',
      estimatedHours: 1,
      billableRate: 150,
      price: 150,
      photoUrl: null,
    },
  })

  const audit = await prisma.serviceComponent.create({
    data: {
      name: 'Financial Audit',
      description: 'Comprehensive audit of financial records to ensure accuracy and compliance.',
      estimatedHours: 20,
      billableRate: 125,
      price: 2500,
      photoUrl: null,
    },
  })

  const quickReview = await prisma.serviceComponent.create({
    data: {
      name: 'Quarterly Review',
      description: 'Quarterly financial review and analysis with recommendations.',
      estimatedHours: 6,
      billableRate: 85,
      price: 510,
      photoUrl: null,
    },
  })

  // Create service bundles with discounted pricing
  const starterBundle = await prisma.serviceBundle.create({
    data: {
      name: 'Startup Essentials',
      description: 'Perfect for new businesses getting started. Includes monthly bookkeeping and quarterly reviews.',
      flatPrice: 2800, // Individual: $600 + $510 = $1110, Bundle saves 10%
      photoUrl: null,
      components: {
        create: [
          { componentId: bookkeeping.id, quantity: 1 },
          { componentId: quickReview.id, quantity: 1 },
        ],
      },
    },
  })

  const growthBundle = await prisma.serviceBundle.create({
    data: {
      name: 'Growth Package',
      description: 'For growing businesses needing comprehensive support. Includes bookkeeping, payroll, and consultation.',
      flatPrice: 950, // Individual: $600 + $320 + $150 = $1070, Bundle saves ~11%
      photoUrl: null,
      components: {
        create: [
          { componentId: bookkeeping.id, quantity: 1 },
          { componentId: payroll.id, quantity: 1 },
          { componentId: consultation.id, quantity: 1 },
        ],
      },
    },
  })

  const premiumBundle = await prisma.serviceBundle.create({
    data: {
      name: 'Premium Full Service',
      description: 'Complete accounting solution for established businesses. All services included.',
      flatPrice: 4200, // Individual: $600 + $1200 + $320 + $510 + $150 = $2780, Bundle saves ~15%
      photoUrl: null,
      components: {
        create: [
          { componentId: bookkeeping.id, quantity: 1 },
          { componentId: taxPrep.id, quantity: 1 },
          { componentId: payroll.id, quantity: 1 },
          { componentId: quickReview.id, quantity: 1 },
          { componentId: consultation.id, quantity: 2 }, // 2 consultations
        ],
      },
    },
  })

  const taxSeasonBundle = await prisma.serviceBundle.create({
    data: {
      name: 'Tax Season Special',
      description: 'Everything you need for tax season. Includes tax prep, audit, and consultation.',
      flatPrice: 3400, // Individual: $1200 + $2500 + $150 = $3850, Bundle saves ~12%
      photoUrl: null,
      components: {
        create: [
          { componentId: taxPrep.id, quantity: 1 },
          { componentId: audit.id, quantity: 1 },
          { componentId: consultation.id, quantity: 1 },
        ],
      },
    },
  })

  console.log('✅ Database seeded successfully!')
  console.log(`   Created ${6} service components`)
  console.log(`   Created ${4} service bundles`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
