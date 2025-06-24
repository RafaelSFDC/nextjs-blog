'use server'

import { prisma } from '@/lib/prisma'
import { postSchema, searchSchema } from '@/lib/validations/post'
import { PostStatus } from '@prisma/client'
import { auth } from '@clerk/nextjs/server'
import { PostWithDetails, PaginatedResult } from '@/types/blog'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { ensureUserSynced, syncCurrentUser } from '@/lib/clerk-sync'

// GET /api/posts - Listar posts com filtros e paginação
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

// GET /api/posts/[id] - Buscar post por ID
export async function getPostById(id: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
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
      throw new Error('Post não encontrado')
    }

    // Verificar se o post está publicado ou se o usuário é o autor
    const user = await syncCurrentUser()

    if (post.status !== PostStatus.PUBLISHED && post.authorId !== user?.id) {
      throw new Error('Post não encontrado')
    }

    return post
  } catch (error) {
    console.error('Error fetching post:', error)
    throw new Error('Erro ao buscar post')
  }
}

// GET /api/posts/slug/[slug] - Buscar post por slug
export async function getPostBySlug(slug: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
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
      throw new Error('Post não encontrado')
    }

    // Verificar se o post está publicado ou se o usuário é o autor
    const user = await syncCurrentUser()

    if (post.status !== PostStatus.PUBLISHED && post.authorId !== user?.id) {
      throw new Error('Post não encontrado')
    }

    return post
  } catch (error) {
    console.error('Error fetching post by slug:', error)
    throw new Error('Erro ao buscar post')
  }
}

// GET /api/posts/[id]/related - Buscar posts relacionados
export async function getRelatedPosts(postId: string, limit: number = 4) {
  try {
    // Primeiro, buscar o post atual para obter categoria e tags
    const currentPost = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        category: true,
        tags: true,
      }
    })

    if (!currentPost) {
      throw new Error('Post não encontrado')
    }

    const tagIds = currentPost.tags.map(tag => tag.id)

    // Buscar posts relacionados
    const relatedPosts = await prisma.post.findMany({
      where: {
        AND: [
          { id: { not: postId } }, // Excluir o post atual
          { status: PostStatus.PUBLISHED },
          {
            OR: [
              // Posts da mesma categoria
              currentPost.categoryId ? { categoryId: currentPost.categoryId } : {},
              // Posts com tags similares
              tagIds.length > 0 ? {
                tags: {
                  some: {
                    id: { in: tagIds }
                  }
                }
              } : {}
            ].filter(condition => Object.keys(condition).length > 0)
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
        createdAt: 'desc'
      },
      take: limit
    })

    return relatedPosts
  } catch (error) {
    console.error('Error fetching related posts:', error)
    throw new Error('Erro ao buscar posts relacionados')
  }
}

// POST /api/posts - Criar novo post
export async function createPost(formData: FormData) {
  try {
    // Sincronizar usuário automaticamente
    const user = await ensureUserSynced()

    const data = {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      excerpt: formData.get('excerpt') as string || undefined,
      content: formData.get('content') as string,
      coverImage: formData.get('coverImage') as string || undefined,
      categoryId: formData.get('categoryId') as string || undefined,
      tagIds: JSON.parse(formData.get('tagIds') as string || '[]'),
      status: formData.get('status') as PostStatus || PostStatus.DRAFT,
      featured: formData.get('featured') === 'true',
    }

    const validatedData = postSchema.parse(data)

    // Verificar se o slug já existe
    const existingPost = await prisma.post.findUnique({
      where: { slug: validatedData.slug }
    })

    if (existingPost) {
      throw new Error('Slug já existe')
    }

    // Criar o post
    const post = await prisma.post.create({
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        excerpt: validatedData.excerpt,
        content: validatedData.content,
        coverImage: validatedData.coverImage,
        status: validatedData.status,
        featured: validatedData.featured,
        publishedAt: validatedData.status === PostStatus.PUBLISHED ? new Date() : validatedData.publishedAt,
        authorId: user.id,
        categoryId: validatedData.categoryId,
        tags: validatedData.tagIds.length > 0 ? {
          connect: validatedData.tagIds.map(id => ({ id }))
        } : undefined,
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

    revalidatePath('/dashboard/posts')
    revalidatePath('/blog')
    revalidatePath('/')

    return post
  } catch (error) {
    console.error('Error creating post:', error)
    throw new Error(error instanceof Error ? error.message : 'Erro ao criar post')
  }
}

// PUT /api/posts/[id] - Atualizar post
export async function updatePost(id: string, formData: FormData) {
  try {
    // Sincronizar usuário automaticamente
    const user = await ensureUserSynced()

    // Verificar se o post existe
    const existingPost = await prisma.post.findUnique({
      where: { id }
    })

    if (!existingPost) {
      throw new Error('Post não encontrado')
    }

    // Verificar se o usuário é o autor ou admin
    if (existingPost.authorId !== user.id && user.role !== 'ADMIN') {
      throw new Error('Sem permissão para editar este post')
    }

    const data = {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      excerpt: formData.get('excerpt') as string || undefined,
      content: formData.get('content') as string,
      coverImage: formData.get('coverImage') as string || undefined,
      categoryId: formData.get('categoryId') as string || undefined,
      tagIds: JSON.parse(formData.get('tagIds') as string || '[]'),
      status: formData.get('status') as PostStatus || PostStatus.DRAFT,
      featured: formData.get('featured') === 'true',
    }

    const validatedData = postSchema.parse(data)

    // Verificar se o slug já existe (exceto para o post atual)
    if (validatedData.slug !== existingPost.slug) {
      const slugExists = await prisma.post.findUnique({
        where: { slug: validatedData.slug }
      })

      if (slugExists) {
        throw new Error('Slug já existe')
      }
    }

    // Atualizar o post
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        excerpt: validatedData.excerpt,
        content: validatedData.content,
        coverImage: validatedData.coverImage,
        status: validatedData.status,
        featured: validatedData.featured,
        publishedAt: validatedData.status === PostStatus.PUBLISHED && existingPost.status !== PostStatus.PUBLISHED
          ? new Date()
          : existingPost.publishedAt,
        categoryId: validatedData.categoryId,
        tags: {
          set: [], // Remove todas as tags existentes
          connect: validatedData.tagIds.map(id => ({ id })) // Conecta as novas tags
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

    revalidatePath('/dashboard/posts')
    revalidatePath('/blog')
    revalidatePath('/')
    revalidatePath(`/blog/${updatedPost.slug}`)

    return updatedPost
  } catch (error) {
    console.error('Error updating post:', error)
    throw new Error(error instanceof Error ? error.message : 'Erro ao atualizar post')
  }
}

// DELETE /api/posts/[id] - Deletar post
export async function deletePost(id: string) {
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

    // Verificar se o post existe
    const existingPost = await prisma.post.findUnique({
      where: { id }
    })

    if (!existingPost) {
      throw new Error('Post não encontrado')
    }

    // Verificar se o usuário é o autor ou admin
    if (existingPost.authorId !== user.id && user.role !== 'ADMIN') {
      throw new Error('Sem permissão para deletar este post')
    }

    // Deletar o post
    await prisma.post.delete({
      where: { id }
    })

    revalidatePath('/dashboard/posts')
    revalidatePath('/blog')
    revalidatePath('/')

    return { success: true }
  } catch (error) {
    console.error('Error deleting post:', error)
    throw new Error(error instanceof Error ? error.message : 'Erro ao deletar post')
  }
}
