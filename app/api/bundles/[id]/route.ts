import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET single bundle
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const bundle = await prisma.serviceBundle.findUnique({
      where: { id: params.id },
      include: {
        components: {
          include: {
            component: true,
          },
        },
      },
    })

    if (!bundle) {
      return NextResponse.json(
        { error: 'Bundle not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(bundle)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch bundle' },
      { status: 500 }
    )
  }
}

// PUT update bundle
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, description, flatPrice, photoUrl, isActive, components } = body

    // If components are provided, delete existing and create new ones
    if (components) {
      await prisma.bundleComponent.deleteMany({
        where: { bundleId: params.id },
      })
    }

    const bundle = await prisma.serviceBundle.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(flatPrice != null && { flatPrice: parseFloat(flatPrice) }),
        ...(photoUrl !== undefined && { photoUrl }),
        ...(isActive !== undefined && { isActive }),
        ...(components && {
          components: {
            create: components.map((comp: { componentId: string; quantity: number }) => ({
              componentId: comp.componentId,
              quantity: comp.quantity || 1,
            })),
          },
        }),
      },
      include: {
        components: {
          include: {
            component: true,
          },
        },
      },
    })

    return NextResponse.json(bundle)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update bundle' },
      { status: 500 }
    )
  }
}

// DELETE bundle
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.serviceBundle.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete bundle' },
      { status: 500 }
    )
  }
}
