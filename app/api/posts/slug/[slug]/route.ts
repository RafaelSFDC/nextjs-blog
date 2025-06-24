import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { PostStatus } from '@prisma/client'

// GET /api/posts/slug/[slug] - Buscar post por slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await prisma.post.findUnique({
      where: { slug: params.slug },
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
        comments: {
          where: {
            status: 'APPROVED',
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
            replies: {
              where: {
                status: 'APPROVED'
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
          }
        },
        _count: {
          select: {
            comments: {
              where: {
                status: 'APPROVED'
              }
            }
          }
        }
      }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se o post está publicado ou se o usuário é o autor
    const { userId } = await auth()
    const user = userId ? await prisma.user.findUnique({
      where: { clerkId: userId }
    }) : null

    if (post.status !== PostStatus.PUBLISHED && post.authorId !== user?.id) {
      return NextResponse.json(
        { error: 'Post não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(post)

  } catch (error) {
    console.error('Error fetching post by slug:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
