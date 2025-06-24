import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, User, MessageCircle, Search, ArrowLeft, Tag } from 'lucide-react'
import { PostWithDetails } from '@/types/blog'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { SearchFilters } from '@/components/search-filters'
import { PaginationControls } from '@/components/pagination-controls'
import { BlogSidebar } from '@/components/blog-sidebar'
import { searchPosts } from '@/app/actions/posts'
import { getCategories, getCategoryBySlug } from '@/app/actions/categories'
import { PostStatus } from '@prisma/client'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{
    query?: string
    tagIds?: string
    featured?: string
    sortBy?: 'createdAt' | 'updatedAt' | 'publishedAt' | 'title'
    sortOrder?: 'asc' | 'desc'
    page?: string
    limit?: string
  }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params

  try {
    const category = await getCategoryBySlug(slug)

    return {
      title: `${category.name} - Categoria | Meu Blog`,
      description: category.description || `Posts da categoria ${category.name}`,
      openGraph: {
        title: `${category.name} - Categoria`,
        description: category.description || `Posts da categoria ${category.name}`,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${category.name} - Categoria`,
        description: category.description || `Posts da categoria ${category.name}`,
      },
    }
  } catch {
    return {
      title: 'Categoria não encontrada | Meu Blog',
    }
  }
}

async function CategoryContent({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params
  const searchParamsData = await searchParams

  try {
    // Buscar categoria
    const category = await getCategoryBySlug(slug)

    // Parse search parameters
    const filters = {
      query: searchParamsData.query,
      categoryId: category.id, // Fixo para esta categoria
      tagIds: searchParamsData.tagIds?.split(','),
      status: PostStatus.PUBLISHED,
      featured: searchParamsData.featured === 'true' ? true : undefined,
      sortBy: searchParamsData.sortBy || 'createdAt',
      sortOrder: searchParamsData.sortOrder || 'desc',
      page: parseInt(searchParamsData.page || '1'),
      limit: parseInt(searchParamsData.limit || '9'),
    }

    // Fetch data in parallel
    const [postsResult, categories] = await Promise.all([
      searchPosts(filters),
      getCategories(true) // includeCount = true
    ])

    return (
      <>
        {/* Category Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/blog">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar ao Blog
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-6 h-6 rounded-full"
              style={{ backgroundColor: category.color || '#6366f1' }}
            />
            <h1 className="text-3xl font-bold">{category.name}</h1>
            <Badge variant="secondary">
              {postsResult.pagination.total} {postsResult.pagination.total === 1 ? 'post' : 'posts'}
            </Badge>
          </div>

          {category.description && (
            <p className="text-lg text-muted-foreground max-w-3xl">
              {category.description}
            </p>
          )}
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Filters */}
            <SearchFilters
              categories={[]} // Não mostrar filtro de categoria pois já estamos em uma
              showFeaturedFilter={true}
              showSortOptions={true}
            />

            {/* Posts Grid */}
            {postsResult.data.length === 0 ? (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Nenhum post encontrado</h3>
                  <p className="text-muted-foreground mb-4">
                    Não há posts nesta categoria ainda.
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
      </>
    )
  } catch (error) {
    console.error('Error fetching category:', error)
    notFound()
  }
}

function PostCard({ post }: { post: PostWithDetails }) {
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
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {post.category && (
              <Badge
                variant="secondary"
                style={{ backgroundColor: (post.category.color || '#6366f1') + '20', color: post.category.color || '#6366f1' }}
              >
                {post.category.name}
              </Badge>
            )}
            {post.featured && <Badge variant="default">Destaque</Badge>}
            {post.tags.slice(0, 2).map((tag) => (
              <Badge key={tag.id} variant="outline" className="text-xs">
                {tag.name}
              </Badge>
            ))}
          </div>

          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>

          {post.excerpt && (
            <p className="text-muted-foreground mb-4 line-clamp-3 text-sm">
              {post.excerpt}
            </p>
          )}

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{post.author.firstName} {post.author.lastName}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{format(new Date(post.publishedAt || post.createdAt), 'dd MMM yyyy', { locale: ptBR })}</span>
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
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="space-y-4">
        <div className="h-8 w-32 bg-muted rounded animate-pulse" />
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-muted rounded-full animate-pulse" />
          <div className="h-8 w-48 bg-muted rounded animate-pulse" />
          <div className="h-6 w-16 bg-muted rounded-full animate-pulse" />
        </div>
        <div className="h-4 w-96 bg-muted rounded animate-pulse" />
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Main Content Skeleton */}
        <div className="lg:col-span-3 space-y-8">
          {/* Filters Skeleton */}
          <div className="space-y-4">
            <div className="h-10 bg-muted rounded-md animate-pulse" />
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
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
          {Array.from({ length: 2 }).map((_, i) => (
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
    </div>
  )
}

export default function CategoryPage({ params, searchParams }: CategoryPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<LoadingSkeleton />}>
          <CategoryContent params={params} searchParams={searchParams} />
        </Suspense>
      </div>

      <Footer />
    </div>
  )
}
