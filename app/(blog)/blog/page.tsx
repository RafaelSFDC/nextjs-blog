import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Calendar, User, MessageCircle } from 'lucide-react'
import { PostWithDetails } from '@/types/blog'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { SearchFilters } from '@/components/search-filters'
import { PaginationControls } from '@/components/pagination-controls'
import { searchPosts } from '@/app/actions/posts'
import { getCategories } from '@/app/actions/categories'
import { PostStatus } from '@prisma/client'

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
    <>
      {/* Search and Filters */}
      <div className="mb-8">
        <SearchFilters
          categories={categories}
          showFeaturedFilter={true}
        />
      </div>

      {/* Posts Grid */}
      {postsResult.data.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum post encontrado</p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
    </>
  )
}

function PostCard({ post }: { post: PostWithDetails }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        {post.coverImage && (
          <div className="aspect-video overflow-hidden rounded-t-lg">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <CardHeader>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {post.category && (
              <Badge
                variant="secondary"
                style={{
                  backgroundColor: (post.category.color || '#6366f1') + '20',
                  color: post.category.color || '#6366f1'
                }}
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
          <CardTitle className="line-clamp-2">
            {post.title}
          </CardTitle>
          {post.excerpt && (
            <CardDescription className="line-clamp-3">
              {post.excerpt}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{format(new Date(post.createdAt), 'dd MMM yyyy', { locale: ptBR })}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{post.author.firstName}</span>
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
      <div className="space-y-4">
        <div className="h-10 bg-muted rounded-md animate-pulse" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 w-20 bg-muted rounded-full animate-pulse" />
          ))}
        </div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="aspect-video bg-muted rounded-lg animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
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

      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<LoadingSkeleton />}>
          <BlogContent searchParams={searchParams} />
        </Suspense>
      </div>

      <Footer />
    </div>
  )
}
