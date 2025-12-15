import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all bundles with their components
export async function GET() {
  try {
    const bundles = await prisma.serviceBundle.findMany({
      where: { isActive: true },
      include: {
        components: {
          include: {
            component: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(bundles)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch bundles' },
      { status: 500 }
    )
  }
}

// POST create new bundle
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, flatPrice, photoUrl, components } = body

    // Validate required fields
    if (!name || !description || flatPrice == null || !components || components.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields or components' },
        { status: 400 }
      )
    }

    // Create bundle with components
    const bundle = await prisma.serviceBundle.create({
      data: {
        name,
        description,
        flatPrice: parseFloat(flatPrice),
        photoUrl: photoUrl || null,
        components: {
          create: components.map((comp: { componentId: string; quantity: number }) => ({
            componentId: comp.componentId,
            quantity: comp.quantity || 1,
          })),
        },
      },
      include: {
        components: {
          include: {
            component: true,
          },
        },
      },
    })

    return NextResponse.json(bundle, { status: 201 })
  } catch (error) {
    console.error('Error creating bundle:', error)
    return NextResponse.json(
      { error: 'Failed to create bundle' },
      { status: 500 }
    )
  }
}
