'use server'

import { prisma } from '@/lib/prisma'
import { categorySchema } from '@/lib/validations/post'
import { revalidatePath } from 'next/cache'
import { CategoryWithCount } from '@/types/blog'
import { ensureUserSynced } from '@/lib/clerk-sync'

// GET /api/categories - Listar todas as categorias
export async function getCategories(): Promise<any[]>
export async function getCategories(includeCount: true): Promise<CategoryWithCount[]>
export async function getCategories(includeCount: false): Promise<any[]>
export async function getCategories(includeCount: boolean = false): Promise<any[]> {
  try {
    const categories = await prisma.category.findMany({
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

    return categories
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw new Error('Erro ao buscar categorias')
  }
}

// GET /api/categories/[id] - Buscar categoria por ID
export async function getCategoryById(id: string) {
  try {
    const category = await prisma.category.findUnique({
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

    if (!category) {
      throw new Error('Categoria não encontrada')
    }

    return category
  } catch (error) {
    console.error('Error fetching category:', error)
    throw new Error('Erro ao buscar categoria')
  }
}

// GET /api/categories/slug/[slug] - Buscar categoria por slug
export async function getCategoryBySlug(slug: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { slug },
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

    if (!category) {
      throw new Error('Categoria não encontrada')
    }

    return category
  } catch (error) {
    console.error('Error fetching category:', error)
    throw new Error('Erro ao buscar categoria')
  }
}

// POST /api/categories - Criar nova categoria
export async function createCategory(formData: FormData) {
  try {
    // Sincronizar usuário automaticamente
    const user = await ensureUserSynced()

    if (user.role !== 'ADMIN' && user.role !== 'EDITOR') {
      throw new Error('Sem permissão para criar categorias')
    }

    const data = {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string,
      description: formData.get('description') as string || undefined,
      color: formData.get('color') as string || '#6366f1',
    }

    const validatedData = categorySchema.parse(data)

    // Verificar se o nome já existe
    const existingName = await prisma.category.findUnique({
      where: { name: validatedData.name }
    })

    if (existingName) {
      throw new Error('Nome da categoria já existe')
    }

    // Verificar se o slug já existe
    const existingSlug = await prisma.category.findUnique({
      where: { slug: validatedData.slug }
    })

    if (existingSlug) {
      throw new Error('Slug da categoria já existe')
    }

    // Criar a categoria
    const category = await prisma.category.create({
      data: validatedData,
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      }
    })

    revalidatePath('/dashboard/categories')
    revalidatePath('/blog')

    return category
  } catch (error) {
    console.error('Error creating category:', error)
    throw new Error(error instanceof Error ? error.message : 'Erro ao criar categoria')
  }
}

// PUT /api/categories/[id] - Atualizar categoria
export async function updateCategory(id: string, formData: FormData) {
  try {
    // Sincronizar usuário automaticamente
    const user = await ensureUserSynced()

    if (user.role !== 'ADMIN' && user.role !== 'EDITOR') {
      throw new Error('Sem permissão para editar categorias')
    }

    // Verificar se a categoria existe
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    })

    if (!existingCategory) {
      throw new Error('Categoria não encontrada')
    }

    const data = {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string,
      description: formData.get('description') as string || undefined,
      color: formData.get('color') as string || '#6366f1',
    }

    const validatedData = categorySchema.parse(data)

    // Verificar se o nome já existe (exceto para a categoria atual)
    if (validatedData.name !== existingCategory.name) {
      const nameExists = await prisma.category.findUnique({
        where: { name: validatedData.name }
      })

      if (nameExists) {
        throw new Error('Nome da categoria já existe')
      }
    }

    // Verificar se o slug já existe (exceto para a categoria atual)
    if (validatedData.slug !== existingCategory.slug) {
      const slugExists = await prisma.category.findUnique({
        where: { slug: validatedData.slug }
      })

      if (slugExists) {
        throw new Error('Slug da categoria já existe')
      }
    }

    // Atualizar a categoria
    const updatedCategory = await prisma.category.update({
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

    revalidatePath('/dashboard/categories')
    revalidatePath('/blog')

    return updatedCategory
  } catch (error) {
    console.error('Error updating category:', error)
    throw new Error(error instanceof Error ? error.message : 'Erro ao atualizar categoria')
  }
}

// DELETE /api/categories/[id] - Deletar categoria
export async function deleteCategory(id: string) {
  try {
    // Sincronizar usuário automaticamente
    const user = await ensureUserSynced()

    if (user.role !== 'ADMIN' && user.role !== 'EDITOR') {
      throw new Error('Sem permissão para deletar categorias')
    }

    // Verificar se a categoria existe
    const existingCategory = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      }
    })

    if (!existingCategory) {
      throw new Error('Categoria não encontrada')
    }

    // Verificar se a categoria tem posts associados
    if (existingCategory._count.posts > 0) {
      throw new Error('Não é possível deletar categoria que possui posts associados')
    }

    // Deletar a categoria
    await prisma.category.delete({
      where: { id }
    })

    revalidatePath('/dashboard/categories')
    revalidatePath('/blog')

    return { success: true }
  } catch (error) {
    console.error('Error deleting category:', error)
    throw new Error(error instanceof Error ? error.message : 'Erro ao deletar categoria')
  }
}
