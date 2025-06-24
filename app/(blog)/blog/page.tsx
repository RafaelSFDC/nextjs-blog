import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, User, MessageCircle, Search, Clock, Eye } from 'lucide-react'
import { PostWithDetails } from '@/types/blog'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { SearchFilters } from '@/components/search-filters'
import { PaginationControls } from '@/components/pagination-controls'
import { BlogSidebar } from '@/components/blog-sidebar'
import { calculateReadingTime } from '@/lib/reading-time'
import { searchPosts } from '@/app/actions/posts'
import { getCategories } from '@/app/actions/categories'
import { PostStatus } from '@prisma/client'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | Meu Blog',
  description: 'Explore artigos sobre desenvolvimento web, tecnologia e carreira. Conteúdo atualizado regularmente sobre programação, Next.js, React e muito mais.',
  keywords: ['blog', 'desenvolvimento web', 'programação', 'artigos', 'tecnologia', 'Next.js', 'React'],
  openGraph: {
    title: 'Blog | Meu Blog',
    description: 'Explore artigos sobre desenvolvimento web, tecnologia e carreira.',
    type: 'website',
    url: '/blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Meu Blog',
    description: 'Explore artigos sobre desenvolvimento web, tecnologia e carreira.',
  },
}

interface BlogPageProps {
  searchParams: Promise<{
    query?: string
    categoryId?: string
    tagIds?: string
    status?: PostStatus
    featured?: string
    authorId?: string
    sortBy?: 'createdAt' | 'updatedAt' | 'publishedAt' | 'title'
    sortOrder?: 'asc' | 'desc'
    page?: string
    limit?: string
  }>
}

async function BlogContent({ searchParams }: BlogPageProps) {
  // Parse search parameters
  const params = await searchParams
  const filters = {
    query: params.query,
    categoryId: params.categoryId,
    tagIds: params.tagIds?.split(','),
    status: PostStatus.PUBLISHED, // Always show only published posts on blog
    featured: params.featured === 'true' ? true : undefined,
    authorId: params.authorId,
    sortBy: params.sortBy || 'createdAt',
    sortOrder: params.sortOrder || 'desc',
    page: parseInt(params.page || '1'),
    limit: parseInt(params.limit || '9'),
  }

  // Fetch data in parallel
  const [postsResult, categories] = await Promise.all([
    searchPosts(filters),
    getCategories(true) // includeCount = true
  ])

  return (
    <div className="grid lg:grid-cols-4 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-3">
        {/* Search and Filters */}
        <div className="mb-8">
          <SearchFilters
            categories={categories}
            showFeaturedFilter={true}
            showSortOptions={true}
          />
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
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {postsResult.pagination.total} {postsResult.pagination.total === 1 ? 'post encontrado' : 'posts encontrados'}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {postsResult.data.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            <PaginationControls
              currentPage={postsResult.pagination.page}
              totalPages={postsResult.pagination.totalPages}
              hasNext={postsResult.pagination.hasNext}
              hasPrev={postsResult.pagination.hasPrev}
              total={postsResult.pagination.total}
              limit={postsResult.pagination.limit}
            />
          </>
        )}
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1">
        <BlogSidebar categories={categories} />
      </div>
    </div>
  )
}

function PostCard({ post }: { post: PostWithDetails }) {
  const readingTime = calculateReadingTime(post.content)

  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer h-full border-0 shadow-md hover:scale-[1.02]">
        {post.coverImage && (
          <div className="aspect-video overflow-hidden rounded-t-lg relative">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {post.category && (
              <Link href={`/category/${post.category.slug}`} onClick={(e) => e.stopPropagation()}>
                <Badge
                  variant="secondary"
                  className="font-medium hover:opacity-80 transition-opacity cursor-pointer"
                  style={{
                    backgroundColor: (post.category.color || '#6366f1') + '20',
                    color: post.category.color || '#6366f1',
                    borderColor: (post.category.color || '#6366f1') + '30'
                  }}
                >
                  {post.category.name}
                </Badge>
              </Link>
            )}
            {post.featured && (
              <Badge variant="default" className="bg-gradient-to-r from-primary to-primary/80">
                ⭐ Destaque
              </Badge>
            )}
          </div>
          <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors duration-200 text-lg">
            {post.title}
          </CardTitle>
          {post.excerpt && (
            <CardDescription className="line-clamp-3 text-sm leading-relaxed">
              {post.excerpt}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="pt-0">
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex items-center gap-1 mb-4 flex-wrap">
              {post.tags.slice(0, 3).map((tag) => (
                <Link key={tag.id} href={`/tag/${tag.slug}`} onClick={(e) => e.stopPropagation()}>
                  <Badge variant="outline" className="text-xs px-2 py-1 hover:bg-muted transition-colors cursor-pointer">
                    #{tag.name}
                  </Badge>
                </Link>
              ))}
              {post.tags.length > 3 && (
                <Badge variant="outline" className="text-xs px-2 py-1">
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

function LoadingSkeleton() {
  return (
    <div className="grid lg:grid-cols-4 gap-8">
      {/* Main Content Skeleton */}
      <div className="lg:col-span-3 space-y-8">
        {/* Filters Skeleton */}
        <div className="space-y-4">
          <div className="h-10 bg-muted rounded-md animate-pulse" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-8 w-20 bg-muted rounded-full animate-pulse" />
            ))}
          </div>
        </div>

        {/* Posts Grid Skeleton */}
        <div className="grid md:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-video bg-muted rounded-lg animate-pulse" />
              <div className="space-y-3 p-4">
                <div className="flex gap-2">
                  <div className="h-5 w-16 bg-muted rounded-full animate-pulse" />
                  <div className="h-5 w-12 bg-muted rounded-full animate-pulse" />
                </div>
                <div className="h-6 bg-muted rounded animate-pulse" />
                <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar Skeleton */}
      <div className="lg:col-span-1 space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-3">
            <div className="h-6 bg-muted rounded animate-pulse w-3/4" />
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="h-4 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function BlogPage({ searchParams }: BlogPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Header />

      {/* Hero Section */}
      <section className="py-16 px-4 bg-background/50 border-b">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Blog
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Compartilhando conhecimento sobre desenvolvimento, tecnologia e experiências pessoais
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<LoadingSkeleton />}>
          <BlogContent searchParams={searchParams} />
        </Suspense>
      </div>

      <Footer />
    </div>
  )
}
