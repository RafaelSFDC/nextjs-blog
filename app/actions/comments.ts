'use server'

import { prisma } from '@/lib/prisma'
import { commentSchema } from '@/lib/validations/post'
import { CommentStatus } from '@prisma/client'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

// GET /api/comments - Listar comentários com filtros
export async function getComments(params: {
  postId?: string
  status?: CommentStatus
  page?: number
  limit?: number
}) {
  try {
    const { postId, status, page = 1, limit = 10 } = params
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

    // Apenas comentários principais (não respostas)
    where.parentId = null

    const skip = (page - 1) * limit

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
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
        },
        skip,
        take: limit,
      }),
      prisma.comment.count({ where })
    ])

    const totalPages = Math.ceil(total / limit)

    return {
      comments,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      }
    }
  } catch (error) {
    console.error('Error fetching comments:', error)
    throw new Error('Erro ao buscar comentários')
  }
}

// GET /api/comments/[id] - Buscar comentário por ID
export async function getCommentById(id: string) {
  try {
    const comment = await prisma.comment.findUnique({
      where: { id },
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
      }
    })

    if (!comment) {
      throw new Error('Comentário não encontrado')
    }

    return comment
  } catch (error) {
    console.error('Error fetching comment:', error)
    throw new Error('Erro ao buscar comentário')
  }
}

// POST /api/comments - Criar novo comentário
export async function createComment(formData: FormData) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      throw new Error('Não autorizado')
    }

    // Verificar se o usuário existe no banco
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      throw new Error('Usuário não encontrado')
    }

    const data = {
      content: formData.get('content') as string,
      postId: formData.get('postId') as string,
      parentId: formData.get('parentId') as string || undefined,
    }

    const validatedData = commentSchema.parse(data)

    // Verificar se o post existe
    const post = await prisma.post.findUnique({
      where: { id: validatedData.postId }
    })

    if (!post) {
      throw new Error('Post não encontrado')
    }

    // Se for uma resposta, verificar se o comentário pai existe
    if (validatedData.parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: validatedData.parentId }
      })

      if (!parentComment) {
        throw new Error('Comentário pai não encontrado')
      }

      // Verificar se o comentário pai pertence ao mesmo post
      if (parentComment.postId !== validatedData.postId) {
        throw new Error('Comentário pai não pertence ao mesmo post')
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

    revalidatePath('/dashboard/comments')
    revalidatePath(`/blog/${post.slug}`)

    return comment
  } catch (error) {
    console.error('Error creating comment:', error)
    throw new Error(error instanceof Error ? error.message : 'Erro ao criar comentário')
  }
}

// PUT /api/comments/[id] - Atualizar comentário (moderação)
export async function updateComment(id: string, formData: FormData) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      throw new Error('Não autorizado')
    }

    // Verificar se o usuário é admin ou editor
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user || (user.role !== 'ADMIN' && user.role !== 'EDITOR')) {
      throw new Error('Sem permissão para moderar comentários')
    }

    // Verificar se o comentário existe
    const existingComment = await prisma.comment.findUnique({
      where: { id },
      include: {
        post: true
      }
    })

    if (!existingComment) {
      throw new Error('Comentário não encontrado')
    }

    const status = formData.get('status') as CommentStatus

    if (!status || !['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      throw new Error('Status inválido')
    }

    // Atualizar o comentário
    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { status },
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

    revalidatePath('/dashboard/comments')
    revalidatePath(`/blog/${existingComment.post.slug}`)

    return updatedComment
  } catch (error) {
    console.error('Error updating comment:', error)
    throw new Error(error instanceof Error ? error.message : 'Erro ao atualizar comentário')
  }
}

// DELETE /api/comments/[id] - Deletar comentário
export async function deleteComment(id: string) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      throw new Error('Não autorizado')
    }

    // Verificar se o usuário é admin ou editor
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user || (user.role !== 'ADMIN' && user.role !== 'EDITOR')) {
      throw new Error('Sem permissão para deletar comentários')
    }

    // Verificar se o comentário existe
    const existingComment = await prisma.comment.findUnique({
      where: { id },
      include: {
        post: true,
        _count: {
          select: {
            replies: true
          }
        }
      }
    })

    if (!existingComment) {
      throw new Error('Comentário não encontrado')
    }

    // Verificar se o comentário tem respostas
    if (existingComment._count.replies > 0) {
      throw new Error('Não é possível deletar comentário que possui respostas')
    }

    // Deletar o comentário
    await prisma.comment.delete({
      where: { id }
    })

    revalidatePath('/dashboard/comments')
    revalidatePath(`/blog/${existingComment.post.slug}`)

    return { success: true }
  } catch (error) {
    console.error('Error deleting comment:', error)
    throw new Error(error instanceof Error ? error.message : 'Erro ao deletar comentário')
  }
}
