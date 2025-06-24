import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { tagSchema } from '@/lib/validations/post'

// GET /api/tags/[id] - Buscar tag por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tag = await prisma.tag.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            posts: {
              where: {
                status: 'PUBLISHED'
              }
            }
          }
        }
      }
    })

    if (!tag) {
      return NextResponse.json(
        { error: 'Tag não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(tag)

  } catch (error) {
    console.error('Error fetching tag:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/tags/[id] - Atualizar tag
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

    // Verificar se o usuário é admin ou editor
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user || (user.role !== 'ADMIN' && user.role !== 'EDITOR')) {
      return NextResponse.json(
        { error: 'Sem permissão para editar tags' },
        { status: 403 }
      )
    }

    // Verificar se a tag existe
    const existingTag = await prisma.tag.findUnique({
      where: { id: params.id }
    })

    if (!existingTag) {
      return NextResponse.json(
        { error: 'Tag não encontrada' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const validatedData = tagSchema.parse(body)

    // Verificar se o nome já existe (exceto para a tag atual)
    if (validatedData.name !== existingTag.name) {
      const nameExists = await prisma.tag.findUnique({
        where: { name: validatedData.name }
      })

      if (nameExists) {
        return NextResponse.json(
          { error: 'Nome da tag já existe' },
          { status: 400 }
        )
      }
    }

    // Verificar se o slug já existe (exceto para a tag atual)
    if (validatedData.slug !== existingTag.slug) {
      const slugExists = await prisma.tag.findUnique({
        where: { slug: validatedData.slug }
      })

      if (slugExists) {
        return NextResponse.json(
          { error: 'Slug da tag já existe' },
          { status: 400 }
        )
      }
    }

    // Atualizar a tag
    const updatedTag = await prisma.tag.update({
      where: { id: params.id },
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        color: validatedData.color,
      },
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      }
    })

    return NextResponse.json(updatedTag)

  } catch (error) {
    console.error('Error updating tag:', error)
    
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

// DELETE /api/tags/[id] - Deletar tag
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

    // Verificar se o usuário é admin
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Sem permissão para deletar tags' },
        { status: 403 }
      )
    }

    // Verificar se a tag existe
    const existingTag = await prisma.tag.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      }
    })

    if (!existingTag) {
      return NextResponse.json(
        { error: 'Tag não encontrada' },
        { status: 404 }
      )
    }

    // Verificar se há posts usando esta tag
    if (existingTag._count.posts > 0) {
      return NextResponse.json(
        { error: 'Não é possível deletar tag que possui posts' },
        { status: 400 }
      )
    }

    // Deletar a tag
    await prisma.tag.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Tag deletada com sucesso' })

  } catch (error) {
    console.error('Error deleting tag:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
