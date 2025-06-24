"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'
import { Search, Calendar, User, MessageCircle } from 'lucide-react'
import { PostWithDetails, CategoryWithCount } from '@/types/blog'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Header } from '@/components/header'

export default function BlogPage() {
  const [posts, setPosts] = useState<PostWithDetails[]>([])
  const [categories, setCategories] = useState<CategoryWithCount[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '9',
        status: 'PUBLISHED',
      })

      if (searchQuery) {
        params.append('query', searchQuery)
      }

      if (categoryFilter !== 'all') {
        params.append('categoryId', categoryFilter)
      }

      const response = await fetch(`/api/posts?${params}`)
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts)
        setTotalPages(data.pagination.totalPages)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories?includeCount=true')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [page, searchQuery, categoryFilter])
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar posts..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Badge
                variant={categoryFilter === 'all' ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                onClick={() => setCategoryFilter('all')}
              >
                Todos
              </Badge>
              {categories.map((category) => (
                <Badge
                  key={category.id}
                  variant={categoryFilter === category.id ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  onClick={() => setCategoryFilter(category.id)}
                  style={{ backgroundColor: categoryFilter === category.id ? (category.color || '#6366f1') : undefined }}
                >
                  {category.name} ({category._count?.posts || 0})
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p>Carregando posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum post encontrado</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
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
          ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Anterior
            </Button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum = i + 1;
              if (totalPages > 5) {
                if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
              }
              return (
                <Button
                  key={pageNum}
                  variant={page === pageNum ? "default" : "outline"}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
            <Button
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Próximo
            </Button>
          </div>
        )}
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
