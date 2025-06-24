"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { CalendarDays, User, ArrowRight, MessageCircle } from 'lucide-react'
import { PostWithDetails } from '@/types/blog'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Header } from '@/components/header'

export default function Home() {
  const [featuredPosts, setFeaturedPosts] = useState<PostWithDetails[]>([])
  const [recentPosts, setRecentPosts] = useState<PostWithDetails[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPosts = async () => {
    try {
      setLoading(true)

      // Buscar posts em destaque
      const featuredResponse = await fetch('/api/posts?featured=true&limit=3&status=PUBLISHED')
      const featuredData = await featuredResponse.json()

      // Buscar posts recentes
      const recentResponse = await fetch('/api/posts?limit=6&status=PUBLISHED&sortBy=createdAt&sortOrder=desc')
      const recentData = await recentResponse.json()

      if (featuredResponse.ok) {
        setFeaturedPosts(featuredData.posts || [])
      }

      if (recentResponse.ok) {
        setRecentPosts(recentData.posts || [])
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Bem-vindo ao Blog
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Um blog moderno construído com Next.js, Prisma e Clerk.
            Compartilhe suas ideias e conecte-se com outros escritores.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/blog">
              <Button size="lg" className="gap-2">
                Explorar Posts <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button variant="outline" size="lg">
                Começar a Escrever
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Posts Preview */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Posts em Destaque</h2>
          {loading ? (
            <div className="text-center py-12">
              <p>Carregando posts...</p>
            </div>
          ) : featuredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Nenhum post em destaque encontrado</p>
              <Link href="/blog">
                <Button variant="outline">Ver Todos os Posts</Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPosts.map((post) => (
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
                        <Badge variant="default">Destaque</Badge>
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
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={post.author.imageUrl || undefined} />
                            <AvatarFallback className="text-xs">
                              {post.author.firstName?.[0]}{post.author.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">
                            {post.author.firstName} {post.author.lastName}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <CalendarDays className="h-4 w-4" />
                            <span>{format(new Date(post.createdAt), 'dd MMM', { locale: ptBR })}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{post._count.comments}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Link href="/blog">
              <Button variant="outline" size="lg">
                Ver Todos os Posts
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="py-16 px-4 bg-background/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Posts Recentes</h2>
          {loading ? (
            <div className="text-center py-12">
              <p>Carregando posts...</p>
            </div>
          ) : recentPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum post encontrado</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPosts.slice(0, 6).map((post) => (
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
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={post.author.imageUrl || undefined} />
                            <AvatarFallback className="text-xs">
                              {post.author.firstName?.[0]}{post.author.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">
                            {post.author.firstName} {post.author.lastName}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <CalendarDays className="h-4 w-4" />
                            <span>{format(new Date(post.createdAt), 'dd MMM', { locale: ptBR })}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{post._count.comments}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 Blog. Construído com Next.js, Prisma e Clerk.</p>
        </div>
      </footer>
    </div>
  )
}
