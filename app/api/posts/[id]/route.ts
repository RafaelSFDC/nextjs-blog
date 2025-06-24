import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { postSchema } from '@/lib/validations/post'
import { PostStatus } from '@prisma/client'

// GET /api/posts/[id] - Buscar post por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: params.id },
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
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/posts/[id] - Atualizar post
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se o post existe
    const existingPost = await prisma.post.findUnique({
      where: { id: params.id }
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se o usuário é o autor ou admin
    if (existingPost.authorId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Sem permissão para editar este post' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = postSchema.parse(body)

    // Verificar se o slug já existe (exceto para o post atual)
    if (validatedData.slug !== existingPost.slug) {
      const slugExists = await prisma.post.findUnique({
        where: { slug: validatedData.slug }
      })

      if (slugExists) {
        return NextResponse.json(
          { error: 'Slug já existe' },
          { status: 400 }
        )
      }
    }

    // Atualizar o post
    const updatedPost = await prisma.post.update({
      where: { id: params.id },
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        excerpt: validatedData.excerpt,
        content: validatedData.content,
        coverImage: validatedData.coverImage,
        status: validatedData.status,
        featured: validatedData.featured,
        publishedAt: validatedData.status === PostStatus.PUBLISHED && !existingPost.publishedAt 
          ? new Date() 
          : validatedData.publishedAt,
        categoryId: validatedData.categoryId,
        tags: {
          set: [], // Remove todas as tags
          connect: validatedData.tagIds.map(id => ({ id })) // Adiciona as novas tags
        },
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

    return NextResponse.json(updatedPost)

  } catch (error) {
    console.error('Error updating post:', error)
    
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

// DELETE /api/posts/[id] - Deletar post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se o post existe
    const existingPost = await prisma.post.findUnique({
      where: { id: params.id }
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se o usuário é o autor ou admin
    if (existingPost.authorId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Sem permissão para deletar este post' },
        { status: 403 }
      )
    }

    // Deletar o post
    await prisma.post.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Post deletado com sucesso' })

  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
