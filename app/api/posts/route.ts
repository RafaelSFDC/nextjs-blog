import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { postSchema, searchSchema } from '@/lib/validations/post'
import { PostStatus } from '@prisma/client'

// GET /api/posts - Listar posts com filtros e paginação
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const validatedParams = searchSchema.parse({
      query: searchParams.get('query') || undefined,
      categoryId: searchParams.get('categoryId') || undefined,
      tagIds: searchParams.get('tagIds')?.split(',') || undefined,
      status: searchParams.get('status') as PostStatus || undefined,
      featured: searchParams.get('featured') === 'true' ? true : undefined,
      authorId: searchParams.get('authorId') || undefined,
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: searchParams.get('sortOrder') || 'desc',
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
    })

    const where: any = {}

    // Filtros
    if (validatedParams.query) {
      where.OR = [
        { title: { contains: validatedParams.query, mode: 'insensitive' } },
        { excerpt: { contains: validatedParams.query, mode: 'insensitive' } },
        { content: { contains: validatedParams.query, mode: 'insensitive' } },
      ]
    }

    if (validatedParams.categoryId) {
      where.categoryId = validatedParams.categoryId
    }

    if (validatedParams.tagIds && validatedParams.tagIds.length > 0) {
      where.tags = {
        some: {
          id: { in: validatedParams.tagIds }
        }
      }
    }

    if (validatedParams.status) {
      where.status = validatedParams.status
    } else {
      // Por padrão, mostrar apenas posts publicados para usuários não autenticados
      const { userId } = await auth()
      if (!userId) {
        where.status = PostStatus.PUBLISHED
      }
    }

    if (validatedParams.featured !== undefined) {
      where.featured = validatedParams.featured
    }

    if (validatedParams.authorId) {
      where.authorId = validatedParams.authorId
    }

    // Paginação
    const skip = (validatedParams.page - 1) * validatedParams.limit

    // Buscar posts
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              imageUrl: true,
              email: true,
            }
          },
          category: true,
          tags: true,
          _count: {
            select: {
              comments: {
                where: {
                  status: 'APPROVED'
                }
              }
            }
          }
        },
        orderBy: {
          [validatedParams.sortBy]: validatedParams.sortOrder
        },
        skip,
        take: validatedParams.limit,
      }),
      prisma.post.count({ where })
    ])

    const totalPages = Math.ceil(total / validatedParams.limit)

    return NextResponse.json({
      posts,
      pagination: {
        page: validatedParams.page,
        limit: validatedParams.limit,
        total,
        totalPages,
        hasNext: validatedParams.page < totalPages,
        hasPrev: validatedParams.page > 1,
      }
    })

  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/posts - Criar novo post
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Verificar se o usuário existe no banco
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const validatedData = postSchema.parse(body)

    // Verificar se o slug já existe
    const existingPost = await prisma.post.findUnique({
      where: { slug: validatedData.slug }
    })

    if (existingPost) {
      return NextResponse.json(
        { error: 'Slug já existe' },
        { status: 400 }
      )
    }

    // Criar o post
    const post = await prisma.post.create({
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        excerpt: validatedData.excerpt,
        content: validatedData.content,
        coverImage: validatedData.coverImage,
        status: validatedData.status,
        featured: validatedData.featured,
        publishedAt: validatedData.status === PostStatus.PUBLISHED ? new Date() : validatedData.publishedAt,
        authorId: user.id,
        categoryId: validatedData.categoryId,
        tags: validatedData.tagIds.length > 0 ? {
          connect: validatedData.tagIds.map(id => ({ id }))
        } : undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            imageUrl: true,
            email: true,
          }
        },
        category: true,
        tags: true,
        _count: {
          select: {
            comments: true
          }
        }
      }
    })

    return NextResponse.json(post, { status: 201 })

  } catch (error) {
    console.error('Error creating post:', error)
    
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
