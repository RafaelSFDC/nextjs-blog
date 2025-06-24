import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Link from 'next/link'
import {
  ArrowLeft,
  PlusCircle,
  Calendar,
  User,
  MessageCircle
} from 'lucide-react'
import { PostWithDetails } from '@/types/blog'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { SearchFilters } from '@/components/search-filters'
import { PaginationControls } from '@/components/pagination-controls'
import { PostActionsDropdown } from '@/components/post-actions-dropdown'
import { searchPosts } from '@/app/actions/posts'
import { PostStatus } from '@prisma/client'

interface PostsPageProps {
  searchParams: Promise<{
    query?: string
    status?: PostStatus
    page?: string
    limit?: string
  }>
}

async function PostsContent({ searchParams }: PostsPageProps) {
  // Parse search parameters
  const params = await searchParams
  const filters = {
    query: params.query,
    status: params.status,
    page: parseInt(params.page || '1'),
    limit: parseInt(params.limit || '10'),
    sortBy: 'createdAt' as const,
    sortOrder: 'desc' as const,
  }

  // Fetch posts
  const postsResult = await searchPosts(filters)

  return (
    <>
      {/* Filtros */}
      <div className="mb-6">
        <SearchFilters
          categories={[]}
          showStatusFilter={true}
          showSortOptions={true}
        />
      </div>

      {/* Tabela */}
      {postsResult.data.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhum post encontrado</p>
        </div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Autor</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Comentários</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="w-[70px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {postsResult.data.map((post) => (
                  <PostRow key={post.id} post={post} />
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Paginação */}
          <div className="mt-6">
            <PaginationControls
              currentPage={postsResult.pagination.page}
              totalPages={postsResult.pagination.totalPages}
              hasNext={postsResult.pagination.hasNext}
              hasPrev={postsResult.pagination.hasPrev}
              total={postsResult.pagination.total}
              limit={postsResult.pagination.limit}
            />
          </div>
        </>
      )}
    </>
  )
}

function PostRow({ post }: { post: PostWithDetails }) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return <Badge variant="default">Publicado</Badge>
      case 'DRAFT':
        return <Badge variant="secondary">Rascunho</Badge>
      case 'ARCHIVED':
        return <Badge variant="outline">Arquivado</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <TableRow>
      <TableCell>
        <div>
          <div className="font-medium">{post.title}</div>
          {post.featured && (
            <Badge variant="outline" className="mt-1">
              Destaque
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell>
        {getStatusBadge(post.status)}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {post.author.firstName} {post.author.lastName}
          </span>
        </div>
      </TableCell>
      <TableCell>
        {post.category ? (
          <Badge variant="secondary">
            {post.category.name}
          </Badge>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <MessageCircle className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{post._count.comments}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            {format(new Date(post.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <PostActionsDropdown post={post} />
      </TableCell>
    </TableRow>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="h-10 bg-muted rounded-md animate-pulse" />
        <div className="flex gap-2">
          <div className="h-8 w-32 bg-muted rounded animate-pulse" />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Autor</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Comentários</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="w-[70px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><div className="h-4 bg-muted rounded animate-pulse" /></TableCell>
                <TableCell><div className="h-6 w-20 bg-muted rounded animate-pulse" /></TableCell>
                <TableCell><div className="h-4 bg-muted rounded animate-pulse" /></TableCell>
                <TableCell><div className="h-6 w-16 bg-muted rounded animate-pulse" /></TableCell>
                <TableCell><div className="h-4 w-8 bg-muted rounded animate-pulse" /></TableCell>
                <TableCell><div className="h-4 w-20 bg-muted rounded animate-pulse" /></TableCell>
                <TableCell><div className="h-8 w-8 bg-muted rounded animate-pulse" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default function PostsPage({ searchParams }: PostsPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Posts</h1>
          </div>
          <Link href="/dashboard/posts/new">
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Novo Post
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Gerenciar Posts</CardTitle>
            <CardDescription>
              Visualize, edite e gerencie todos os posts do blog
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<LoadingSkeleton />}>
              <PostsContent searchParams={searchParams} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
