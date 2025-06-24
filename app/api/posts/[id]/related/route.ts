import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PostStatus } from '@prisma/client'

// GET /api/posts/[id]/related - Buscar posts relacionados
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '4')

    // Primeiro, buscar o post atual para obter categoria e tags
    const currentPost = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        category: true,
        tags: true,
      }
    })

    if (!currentPost) {
      return NextResponse.json(
        { error: 'Post não encontrado' },
        { status: 404 }
      )
    }

    // Buscar posts relacionados baseado em categoria e tags
    const relatedPosts = await prisma.post.findMany({
      where: {
        AND: [
          { id: { not: postId } }, // Excluir o post atual
          { status: PostStatus.PUBLISHED }, // Apenas posts publicados
          {
            OR: [
              // Posts da mesma categoria
              currentPost.categoryId ? {
                categoryId: currentPost.categoryId
              } : {},
              // Posts com tags similares
              currentPost.tags.length > 0 ? {
                tags: {
                  some: {
                    id: {
                      in: currentPost.tags.map(tag => tag.id)
                    }
                  }
                }
              } : {}
            ]
          }
        ]
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
            comments: {
              where: {
                status: 'APPROVED'
              }
            }
          }
        }
      },
      orderBy: [
        { featured: 'desc' }, // Posts em destaque primeiro
        { createdAt: 'desc' }  // Depois por data
      ],
      take: limit,
    })

    return NextResponse.json({
      posts: relatedPosts,
      total: relatedPosts.length
    })

  } catch (error) {
    console.error('Error fetching related posts:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
