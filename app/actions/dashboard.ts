'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

export interface BlogStats {
  totalPosts: number
  totalPublishedPosts: number
  totalDraftPosts: number
  totalCategories: number
  totalTags: number
  totalComments: number
  totalUsers: number
  pendingComments: number
  recentPosts: Array<{
    id: string
    title: string
    slug: string
    status: string
    createdAt: Date
    author: {
      firstName: string | null
      lastName: string | null
    }
  }>
  recentComments: Array<{
    id: string
    content: string
    status: string
    createdAt: Date
    author: {
      firstName: string | null
      lastName: string | null
    }
    post: {
      title: string
      slug: string
    }
  }>
}

// GET /api/dashboard/stats - Buscar estatísticas do dashboard
export async function getDashboardStats(): Promise<BlogStats> {
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

    // Buscar estatísticas gerais
    const [
      totalPosts,
      totalPublishedPosts,
      totalDraftPosts,
      totalCategories,
      totalTags,
      totalComments,
      totalUsers,
      pendingComments,
      recentPosts,
      recentComments
    ] = await Promise.all([
      // Total de posts
      prisma.post.count(),

      // Posts publicados
      prisma.post.count({
        where: { status: 'PUBLISHED' }
      }),

      // Posts em rascunho
      prisma.post.count({
        where: { status: 'DRAFT' }
      }),

      // Total de categorias
      prisma.category.count(),

      // Total de tags
      prisma.tag.count(),

      // Total de comentários
      prisma.comment.count(),

      // Total de usuários
      prisma.user.count(),

      // Comentários pendentes
      prisma.comment.count({
        where: { status: 'PENDING' }
      }),

      // Posts recentes
      prisma.post.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          createdAt: true,
          author: {
            select: {
              firstName: true,
              lastName: true,
            }
          },
          category: {
            select: {
              name: true,
            }
          },
          _count: {
            select: {
              comments: true
            }
          }
        }
      }),

      // Comentários recentes
      prisma.comment.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          content: true,
          status: true,
          createdAt: true,
          author: {
            select: {
              firstName: true,
              lastName: true,
            }
          },
          post: {
            select: {
              title: true,
              slug: true,
            }
          }
        }
      })
    ])

    return {
      totalPosts,
      totalPublishedPosts,
      totalDraftPosts,
      totalCategories,
      totalTags,
      totalComments,
      totalUsers,
      pendingComments,
      recentPosts,
      recentComments
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    throw new Error('Erro ao buscar estatísticas do dashboard')
  }
}

// Alias para compatibilidade
export const getBlogStats = getDashboardStats

// Função auxiliar para buscar estatísticas de posts por período
export async function getPostsStatsByPeriod(days: number = 30) {
  try {
    const { userId } = await auth()

    if (!userId) {
      throw new Error('Não autorizado')
    }

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const stats = await prisma.post.groupBy({
      by: ['status'],
      where: {
        createdAt: {
          gte: startDate
        }
      },
      _count: {
        id: true
      }
    })

    return stats.reduce((acc, stat) => {
      acc[stat.status] = stat._count.id
      return acc
    }, {} as Record<string, number>)
  } catch (error) {
    console.error('Error fetching posts stats by period:', error)
    throw new Error('Erro ao buscar estatísticas de posts por período')
  }
}

// Função auxiliar para buscar estatísticas de comentários por período
export async function getCommentsStatsByPeriod(days: number = 30) {
  try {
    const { userId } = await auth()

    if (!userId) {
      throw new Error('Não autorizado')
    }

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const stats = await prisma.comment.groupBy({
      by: ['status'],
      where: {
        createdAt: {
          gte: startDate
        }
      },
      _count: {
        id: true
      }
    })

    return stats.reduce((acc, stat) => {
      acc[stat.status] = stat._count.id
      return acc
    }, {} as Record<string, number>)
  } catch (error) {
    console.error('Error fetching comments stats by period:', error)
    throw new Error('Erro ao buscar estatísticas de comentários por período')
  }
}

// Função auxiliar para buscar posts mais populares
export async function getPopularPosts(limit: number = 10) {
  try {
    const { userId } = await auth()

    if (!userId) {
      throw new Error('Não autorizado')
    }

    const posts = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED'
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
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
      },
      orderBy: {
        comments: {
          _count: 'desc'
        }
      },
      take: limit
    })

    return posts
  } catch (error) {
    console.error('Error fetching popular posts:', error)
    throw new Error('Erro ao buscar posts populares')
  }
}

// Função auxiliar para buscar categorias mais utilizadas
export async function getPopularCategories(limit: number = 10) {
  try {
    const { userId } = await auth()

    if (!userId) {
      throw new Error('Não autorizado')
    }

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
        posts: {
          _count: 'desc'
        }
      },
      take: limit
    })

    return categories
  } catch (error) {
    console.error('Error fetching popular categories:', error)
    throw new Error('Erro ao buscar categorias populares')
  }
}
