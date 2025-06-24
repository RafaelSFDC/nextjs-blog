'use server'

import { prisma } from '@/lib/prisma'
import { searchSchema } from '@/lib/validations/post'
import { PostStatus } from '@prisma/client'
import { auth } from '@clerk/nextjs/server'
import { PostWithDetails, PaginatedResult } from '@/types/blog'

export async function searchPosts(searchParams: {
  query?: string
  categoryId?: string
  tagIds?: string[]
  status?: PostStatus
  featured?: boolean
  authorId?: string
  sortBy?: 'createdAt' | 'updatedAt' | 'publishedAt' | 'title'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}): Promise<PaginatedResult<PostWithDetails>> {
  try {
    const validatedParams = searchSchema.parse({
      query: searchParams.query || undefined,
      categoryId: searchParams.categoryId || undefined,
      tagIds: searchParams.tagIds || undefined,
      status: searchParams.status || undefined,
      featured: searchParams.featured,
      authorId: searchParams.authorId || undefined,
      sortBy: searchParams.sortBy || 'createdAt',
      sortOrder: searchParams.sortOrder || 'desc',
      page: searchParams.page || 1,
      limit: searchParams.limit || 10,
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

    return {
      data: posts as PostWithDetails[],
      pagination: {
        page: validatedParams.page,
        limit: validatedParams.limit,
        total,
        totalPages,
        hasNext: validatedParams.page < totalPages,
        hasPrev: validatedParams.page > 1,
      }
    }

  } catch (error) {
    console.error('Error searching posts:', error)
    throw new Error('Erro ao buscar posts')
  }
}

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
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
      },
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

export async function getTags() {
  try {
    const tags = await prisma.tag.findMany({
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
      },
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
