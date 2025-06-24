import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// GET /api/dashboard/stats - Buscar estatísticas do dashboard
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Verificar se o usuário existe no banco
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
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
        orderBy: { createdAt: 'desc' },
        include: {
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
        orderBy: { createdAt: 'desc' },
        include: {
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

    // Estatísticas por mês (últimos 6 meses)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const monthlyStats = await prisma.post.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: sixMonthsAgo
        }
      },
      _count: {
        id: true
      }
    })

    // Processar estatísticas mensais
    const monthlyData = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      const count = monthlyStats.filter(stat => {
        const statDate = new Date(stat.createdAt)
        const statKey = `${statDate.getFullYear()}-${String(statDate.getMonth() + 1).padStart(2, '0')}`
        return statKey === monthKey
      }).reduce((sum, stat) => sum + stat._count.id, 0)

      monthlyData.push({
        month: monthKey,
        posts: count
      })
    }

    const stats = {
      totalPosts,
      totalPublishedPosts,
      totalDraftPosts,
      totalCategories,
      totalTags,
      totalComments,
      totalUsers,
      pendingComments,
      recentPosts,
      recentComments,
      monthlyData
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
