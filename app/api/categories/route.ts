import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { categorySchema } from '@/lib/validations/post'

// GET /api/categories - Listar todas as categorias
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeCount = searchParams.get('includeCount') === 'true'

    const categories = await prisma.category.findMany({
      include: includeCount ? {
        _count: {
          select: {
            posts: {
              where: {
                status: 'PUBLISHED'
              }
            }
          }
        }
      } : undefined,
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(categories)

  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/categories - Criar nova categoria
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Verificar se o usuário é admin ou editor
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user || (user.role !== 'ADMIN' && user.role !== 'EDITOR')) {
      return NextResponse.json(
        { error: 'Sem permissão para criar categorias' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = categorySchema.parse(body)

    // Verificar se o nome já existe
    const existingName = await prisma.category.findUnique({
      where: { name: validatedData.name }
    })

    if (existingName) {
      return NextResponse.json(
        { error: 'Nome da categoria já existe' },
        { status: 400 }
      )
    }

    // Verificar se o slug já existe
    const existingSlug = await prisma.category.findUnique({
      where: { slug: validatedData.slug }
    })

    if (existingSlug) {
      return NextResponse.json(
        { error: 'Slug da categoria já existe' },
        { status: 400 }
      )
    }

    // Criar a categoria
    const category = await prisma.category.create({
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        description: validatedData.description,
        color: validatedData.color || '#6366f1',
      },
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      }
    })

    return NextResponse.json(category, { status: 201 })

  } catch (error) {
    console.error('Error creating category:', error)
    
    if (error instanceof Error && error.message.includes('validation')) {
      return NextResponse.json(
        { error: 'Dados inválidos' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
