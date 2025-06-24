import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { commentSchema } from '@/lib/validations/post'

// GET /api/comments - Listar comentários com filtros
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('postId')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: any = {}

    if (postId) {
      where.postId = postId
    }

    if (status) {
      where.status = status
    } else {
      // Por padrão, mostrar apenas comentários aprovados para usuários não autenticados
      const { userId } = await auth()
      if (!userId) {
        where.status = 'APPROVED'
      }
    }

    // Paginação
    const skip = (page - 1) * limit

    // Buscar comentários
    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: {
          ...where,
          parentId: null, // Apenas comentários principais
        },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              imageUrl: true,
            }
          },
          post: {
            select: {
              id: true,
              title: true,
              slug: true,
            }
          },
          replies: {
            where: {
              status: where.status || 'APPROVED'
            },
            include: {
              author: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  imageUrl: true,
                }
              }
            },
            orderBy: {
              createdAt: 'asc'
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit,
      }),
      prisma.comment.count({ 
        where: {
          ...where,
          parentId: null
        }
      })
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      comments,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      }
    })

  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/comments - Criar novo comentário
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
    const validatedData = commentSchema.parse(body)

    // Verificar se o post existe
    const post = await prisma.post.findUnique({
      where: { id: validatedData.postId }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post não encontrado' },
        { status: 404 }
      )
    }

    // Se é uma resposta, verificar se o comentário pai existe
    if (validatedData.parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: validatedData.parentId }
      })

      if (!parentComment) {
        return NextResponse.json(
          { error: 'Comentário pai não encontrado' },
          { status: 404 }
        )
      }

      if (parentComment.postId !== validatedData.postId) {
        return NextResponse.json(
          { error: 'Comentário pai não pertence ao mesmo post' },
          { status: 400 }
        )
      }
    }

    // Criar o comentário
    const comment = await prisma.comment.create({
      data: {
        content: validatedData.content,
        postId: validatedData.postId,
        authorId: user.id,
        parentId: validatedData.parentId,
        status: 'PENDING', // Comentários ficam pendentes por padrão
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            imageUrl: true,
          }
        },
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
          }
        }
      }
    })

    return NextResponse.json(comment, { status: 201 })

  } catch (error) {
    console.error('Error creating comment:', error)
    
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
