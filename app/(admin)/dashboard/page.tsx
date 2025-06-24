import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import {
  PlusCircle,
  FileText,
  Users,
  MessageCircle,
  TrendingUp,
  Eye,
  Calendar,
  Tag
} from 'lucide-react'
import { getDashboardStats } from '@/app/actions/dashboard'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const stats = await getDashboardStats()
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold">Dashboard</h1>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link href="/blog">
              <Button variant="ghost">Ver Blog</Button>
            </Link>
            <Link href="/dashboard/posts/new">
              <Button className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Novo Post
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPosts}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalPublishedPosts} publicados, {stats.totalDraftPosts} rascunhos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">
                +15% desde a semana passada
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Comentários</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalComments}</div>
              <p className="text-xs text-muted-foreground">
                {stats.pendingComments} pendentes de moderação
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Usuários registrados
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Posts */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Posts Recentes</CardTitle>
                  <Link href="/dashboard/posts">
                    <Button variant="outline" size="sm">
                      Ver todos
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentPosts.map((post) => (
                    <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium mb-1 line-clamp-1">
                          {post.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(post.createdAt).toLocaleDateString('pt-BR')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            <span>{(post as any)._count.comments}</span>
                          </div>
                          {(post as any).category && (
                            <div className="flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              <span>{(post as any).category.name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Badge variant={post.status === 'PUBLISHED' ? "default" : "secondary"}>
                        {post.status === 'PUBLISHED' ? "Publicado" : "Rascunho"}
                      </Badge>
                    </div>
                  ))}
                  {stats.recentPosts.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">
                      Nenhum post encontrado
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/dashboard/posts/new">
                  <Button className="w-full gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Novo Post
                  </Button>
                </Link>
                <Link href="/dashboard/categories">
                  <Button variant="outline" className="w-full gap-2">
                    <Tag className="h-4 w-4" />
                    Gerenciar Categorias
                  </Button>
                </Link>
                <Link href="/dashboard/comments">
                  <Button variant="outline" className="w-full gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Moderar Comentários
                  </Button>
                </Link>
                <Link href="/dashboard/tags">
                  <Button variant="outline" className="w-full gap-2">
                    <Tag className="h-4 w-4" />
                    Gerenciar Tags
                  </Button>
                </Link>
                <Link href="/dashboard/analytics">
                  <Button variant="outline" className="w-full gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Ver Analytics
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Recent Comments */}
            <Card>
              <CardHeader>
                <CardTitle>Comentários Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentComments.map((comment) => (
                    <div key={comment.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          {comment.author.firstName} {comment.author.lastName}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {comment.status === 'PENDING' ? 'Pendente' :
                           comment.status === 'APPROVED' ? 'Aprovado' : 'Rejeitado'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {comment.content}
                      </p>
                      <div className="text-xs text-muted-foreground">
                        em: {comment.post.title}
                      </div>
                    </div>
                  ))}
                  {stats.recentComments.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">
                      Nenhum comentário encontrado
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 Blog. Construído com Next.js, Prisma e Clerk.</p>
        </div>
      </footer>
    </div>
  )
}
