import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { CommentStatus } from '@prisma/client'

// GET /api/comments/[id] - Buscar comentário por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: params.id },
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
      return NextResponse.json(
        { error: 'Comentário não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se o comentário está aprovado ou se o usuário é o autor/admin
    const { userId } = await auth()
    const user = userId ? await prisma.user.findUnique({
      where: { clerkId: userId }
    }) : null

    if (comment.status !== CommentStatus.APPROVED && 
        comment.authorId !== user?.id && 
        user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Comentário não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(comment)

  } catch (error) {
    console.error('Error fetching comment:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/comments/[id] - Atualizar comentário (moderação)
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

    // Verificar se o comentário existe
    const existingComment = await prisma.comment.findUnique({
      where: { id: params.id }
    })

    if (!existingComment) {
      return NextResponse.json(
        { error: 'Comentário não encontrado' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { status, content } = body

    // Verificar permissões
    const canModerate = user.role === 'ADMIN' || user.role === 'EDITOR'
    const isAuthor = existingComment.authorId === user.id

    if (status && !canModerate) {
      return NextResponse.json(
        { error: 'Sem permissão para moderar comentários' },
        { status: 403 }
      )
    }

    if (content && !isAuthor && !canModerate) {
      return NextResponse.json(
        { error: 'Sem permissão para editar este comentário' },
        { status: 403 }
      )
    }

    // Preparar dados para atualização
    const updateData: any = {}

    if (status && canModerate) {
      if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
        return NextResponse.json(
          { error: 'Status inválido' },
          { status: 400 }
        )
      }
      updateData.status = status
    }

    if (content && (isAuthor || canModerate)) {
      if (typeof content !== 'string' || content.trim().length === 0) {
        return NextResponse.json(
          { error: 'Conteúdo inválido' },
          { status: 400 }
        )
      }
      updateData.content = content.trim()
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'Nenhum dado para atualizar' },
        { status: 400 }
      )
    }

    // Atualizar o comentário
    const updatedComment = await prisma.comment.update({
      where: { id: params.id },
      data: updateData,
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

    return NextResponse.json(updatedComment)

  } catch (error) {
    console.error('Error updating comment:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/comments/[id] - Deletar comentário
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

    // Verificar se o comentário existe
    const existingComment = await prisma.comment.findUnique({
      where: { id: params.id }
    })

    if (!existingComment) {
      return NextResponse.json(
        { error: 'Comentário não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se o usuário é o autor ou admin
    if (existingComment.authorId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Sem permissão para deletar este comentário' },
        { status: 403 }
      )
    }

    // Deletar o comentário (e suas respostas em cascata)
    await prisma.comment.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Comentário deletado com sucesso' })

  } catch (error) {
    console.error('Error deleting comment:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
