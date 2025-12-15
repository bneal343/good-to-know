import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET single component
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const component = await prisma.serviceComponent.findUnique({
      where: { id: params.id },
    })

    if (!component) {
      return NextResponse.json(
        { error: 'Component not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(component)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch component' },
      { status: 500 }
    )
  }
}

// PUT update component
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, description, estimatedHours, billableRate, price, photoUrl, isActive } = body

    const component = await prisma.serviceComponent.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(estimatedHours != null && { estimatedHours: parseFloat(estimatedHours) }),
        ...(billableRate != null && { billableRate: parseFloat(billableRate) }),
        ...(price != null && { price: parseFloat(price) }),
        ...(photoUrl !== undefined && { photoUrl }),
        ...(isActive !== undefined && { isActive }),
      },
    })

    return NextResponse.json(component)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update component' },
      { status: 500 }
    )
  }
}

// DELETE component
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.serviceComponent.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete component' },
      { status: 500 }
    )
  }
}
