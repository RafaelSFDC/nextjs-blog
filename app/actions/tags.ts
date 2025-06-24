'use server'

import { prisma } from '@/lib/prisma'
import { tagSchema } from '@/lib/validations/post'
import { revalidatePath } from 'next/cache'
import { ensureUserSynced } from '@/lib/clerk-sync'

// GET /api/tags - Listar todas as tags
export async function getTags(includeCount: boolean = false) {
  try {
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

    return tags
  } catch (error) {
    console.error('Error fetching tags:', error)
    throw new Error('Erro ao buscar tags')
  }
}

// GET /api/tags/[id] - Buscar tag por ID
export async function getTagById(id: string) {
  try {
    const tag = await prisma.tag.findUnique({
      where: { id },
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
      throw new Error('Tag não encontrada')
    }

    return tag
  } catch (error) {
    console.error('Error fetching tag:', error)
    throw new Error('Erro ao buscar tag')
  }
}

// POST /api/tags - Criar nova tag
export async function createTag(formData: FormData) {
  try {
    // Sincronizar usuário automaticamente
    const user = await ensureUserSynced()

    if (user.role !== 'ADMIN' && user.role !== 'EDITOR') {
      throw new Error('Sem permissão para criar tags')
    }

    const data = {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string,
      color: formData.get('color') as string || '#10b981',
    }

    const validatedData = tagSchema.parse(data)

    // Verificar se o nome já existe
    const existingName = await prisma.tag.findUnique({
      where: { name: validatedData.name }
    })

    if (existingName) {
      throw new Error('Nome da tag já existe')
    }

    // Verificar se o slug já existe
    const existingSlug = await prisma.tag.findUnique({
      where: { slug: validatedData.slug }
    })

    if (existingSlug) {
      throw new Error('Slug da tag já existe')
    }

    // Criar a tag
    const tag = await prisma.tag.create({
      data: validatedData,
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      }
    })

    revalidatePath('/dashboard/tags')
    revalidatePath('/blog')

    return tag
  } catch (error) {
    console.error('Error creating tag:', error)
    throw new Error(error instanceof Error ? error.message : 'Erro ao criar tag')
  }
}

// PUT /api/tags/[id] - Atualizar tag
export async function updateTag(id: string, formData: FormData) {
  try {
    // Sincronizar usuário automaticamente
    const user = await ensureUserSynced()

    if (user.role !== 'ADMIN' && user.role !== 'EDITOR') {
      throw new Error('Sem permissão para editar tags')
    }

    // Verificar se a tag existe
    const existingTag = await prisma.tag.findUnique({
      where: { id }
    })

    if (!existingTag) {
      throw new Error('Tag não encontrada')
    }

    const data = {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string,
      color: formData.get('color') as string || '#10b981',
    }

    const validatedData = tagSchema.parse(data)

    // Verificar se o nome já existe (exceto para a tag atual)
    if (validatedData.name !== existingTag.name) {
      const nameExists = await prisma.tag.findUnique({
        where: { name: validatedData.name }
      })

      if (nameExists) {
        throw new Error('Nome da tag já existe')
      }
    }

    // Verificar se o slug já existe (exceto para a tag atual)
    if (validatedData.slug !== existingTag.slug) {
      const slugExists = await prisma.tag.findUnique({
        where: { slug: validatedData.slug }
      })

      if (slugExists) {
        throw new Error('Slug da tag já existe')
      }
    }

    // Atualizar a tag
    const updatedTag = await prisma.tag.update({
      where: { id },
      data: validatedData,
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      }
    })

    revalidatePath('/dashboard/tags')
    revalidatePath('/blog')

    return updatedTag
  } catch (error) {
    console.error('Error updating tag:', error)
    throw new Error(error instanceof Error ? error.message : 'Erro ao atualizar tag')
  }
}

// DELETE /api/tags/[id] - Deletar tag
export async function deleteTag(id: string) {
  try {
    // Sincronizar usuário automaticamente
    const user = await ensureUserSynced()

    if (user.role !== 'ADMIN' && user.role !== 'EDITOR') {
      throw new Error('Sem permissão para deletar tags')
    }

    // Verificar se a tag existe
    const existingTag = await prisma.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      }
    })

    if (!existingTag) {
      throw new Error('Tag não encontrada')
    }

    // Verificar se a tag tem posts associados
    if (existingTag._count.posts > 0) {
      throw new Error('Não é possível deletar tag que possui posts associados')
    }

    // Deletar a tag
    await prisma.tag.delete({
      where: { id }
    })

    revalidatePath('/dashboard/tags')
    revalidatePath('/blog')

    return { success: true }
  } catch (error) {
    console.error('Error deleting tag:', error)
    throw new Error(error instanceof Error ? error.message : 'Erro ao deletar tag')
  }
}
