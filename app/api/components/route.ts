import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all components
export async function GET() {
  try {
    const components = await prisma.serviceComponent.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(components)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch components' },
      { status: 500 }
    )
  }
}

// POST create new component
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, estimatedHours, billableRate, price, photoUrl } = body

    // Validate required fields
    if (!name || !description || estimatedHours == null || billableRate == null || price == null) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const component = await prisma.serviceComponent.create({
      data: {
        name,
        description,
        estimatedHours: parseFloat(estimatedHours),
        billableRate: parseFloat(billableRate),
        price: parseFloat(price),
        photoUrl: photoUrl || null,
      },
    })

    return NextResponse.json(component, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create component' },
      { status: 500 }
    )
  }
}
