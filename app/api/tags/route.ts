import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { tagSchema } from '@/lib/validations/post'

// GET /api/tags - Listar todas as tags
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeCount = searchParams.get('includeCount') === 'true'

    const tags = await prisma.tag.findMany({
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

    return NextResponse.json(tags)

  } catch (error) {
    console.error('Error fetching tags:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/tags - Criar nova tag
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
        { error: 'Sem permissão para criar tags' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = tagSchema.parse(body)

    // Verificar se o nome já existe
    const existingName = await prisma.tag.findUnique({
      where: { name: validatedData.name }
    })

    if (existingName) {
      return NextResponse.json(
        { error: 'Nome da tag já existe' },
        { status: 400 }
      )
    }

    // Verificar se o slug já existe
    const existingSlug = await prisma.tag.findUnique({
      where: { slug: validatedData.slug }
    })

    if (existingSlug) {
      return NextResponse.json(
        { error: 'Slug da tag já existe' },
        { status: 400 }
      )
    }

    // Criar a tag
    const tag = await prisma.tag.create({
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        color: validatedData.color || '#10b981',
      },
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      }
    })

    return NextResponse.json(tag, { status: 201 })

  } catch (error) {
    console.error('Error creating tag:', error)
    
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
