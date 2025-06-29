import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, User, MessageCircle, Search, Clock } from 'lucide-react'
import { PostWithDetails } from '@/types/blog'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { calculateReadingTime } from '@/lib/reading-time'
import { searchPosts } from '@/app/actions/posts'
import { getCategories } from '@/app/actions/categories'
import { PostStatus } from '@prisma/client'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | Meu Blog',
  description: 'Explore artigos sobre desenvolvimento web, tecnologia e carreira.',
}

interface BlogPageProps {
  searchParams: Promise<{
    query?: string
    categoryId?: string
    page?: string
  }>
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams
  
  // Parse parameters with proper types
  const page = parseInt(params.page || '1')
  
  const filters = {
    query: params.query,
    categoryId: params.categoryId,
    status: PostStatus.PUBLISHED,
    page,
    limit: 9,
    sortBy: 'createdAt' as const,
    sortOrder: 'desc' as const,
  }

  // Fetch data
  const [postsResult, categories] = await Promise.all([
    searchPosts(filters),
    getCategories(true)
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Header />

      {/* Hero Section */}
      <section className="py-16 px-4 bg-background/50 border-b">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Blog</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Compartilhando conhecimento sobre desenvolvimento, tecnologia e experiências pessoais
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Simple Search */}
            <div className="mb-8">
              <form method="GET" className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <input
                      type="text"
                      name="query"
                      placeholder="Buscar posts..."
                      defaultValue={params.query || ''}
                      className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-md"
                    />
                  </div>
                </div>
                <Button type="submit">Buscar</Button>
              </form>
            </div>

            {/* Category Filter */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2">
                <Link href="/blog">
                  <Badge variant={!params.categoryId ? "default" : "outline"}>
                    Todos
                  </Badge>
                </Link>
                {categories.map((category) => (
                  <Link key={category.id} href={`/blog?categoryId=${category.id}`}>
                    <Badge variant={params.categoryId === category.id ? "default" : "outline"}>
                      {category.name} ({category._count.posts})
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>

            {/* Posts Grid */}
            {postsResult.data.length === 0 ? (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Nenhum post encontrado</h3>
                  <p className="text-muted-foreground mb-4">
                    Tente ajustar os filtros ou buscar por outros termos
                  </p>
                  <Link href="/blog">
                    <Button variant="outline">Ver todos os posts</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Results Summary */}
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground">
                    {postsResult.pagination.total} {postsResult.pagination.total === 1 ? 'post encontrado' : 'posts encontrados'}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {postsResult.data.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>

                {/* Simple Pagination */}
                {postsResult.pagination.totalPages > 1 && (
                  <div className="flex justify-center gap-2">
                    {postsResult.pagination.hasPrev && (
                      <Link href={`/blog?page=${page - 1}${params.query ? `&query=${params.query}` : ''}${params.categoryId ? `&categoryId=${params.categoryId}` : ''}`}>
                        <Button variant="outline">Anterior</Button>
                      </Link>
                    )}
                    
                    <span className="flex items-center px-4">
                      Página {page} de {postsResult.pagination.totalPages}
                    </span>
                    
                    {postsResult.pagination.hasNext && (
                      <Link href={`/blog?page=${page + 1}${params.query ? `&query=${params.query}` : ''}${params.categoryId ? `&categoryId=${params.categoryId}` : ''}`}>
                        <Button variant="outline">Próxima</Button>
                      </Link>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Categorias</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Link key={category.id} href={`/blog?categoryId=${category.id}`}>
                      <div className="flex items-center justify-between p-2 rounded hover:bg-muted">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-primary" />
                          <span className="text-sm">{category.name}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {category._count.posts}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

function PostCard({ post }: { post: PostWithDetails }) {
  const readingTime = calculateReadingTime(post.content)

  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer h-full">
        {post.coverImage && (
          <div className="aspect-video overflow-hidden rounded-t-lg relative">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {post.category && (
              <Badge variant="secondary">
                {post.category.name}
              </Badge>
            )}
            {post.featured && (
              <Badge variant="default">⭐ Destaque</Badge>
            )}
          </div>
          <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors text-lg">
            {post.title}
          </CardTitle>
          {post.excerpt && (
            <CardDescription className="line-clamp-3 text-sm">
              {post.excerpt}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="pt-0">
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex items-center gap-1 mb-4 flex-wrap">
              {post.tags.slice(0, 3).map((tag) => (
                <Badge key={tag.id} variant="outline" className="text-xs">
                  #{tag.name}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{post.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Meta info */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{format(new Date(post.createdAt), 'dd MMM yyyy', { locale: ptBR })}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{post.author.firstName}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{readingTime.text}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-3 w-3" />
              <span>{post._count.comments}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
