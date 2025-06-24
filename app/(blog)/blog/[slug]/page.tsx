"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import { CalendarDays, User, ArrowLeft, Share2, Heart, MessageCircle, Send } from 'lucide-react'
import { PostWithDetails } from '@/types/blog'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useUser } from '@clerk/nextjs'
import { toast } from 'sonner'
import { Header } from '@/components/header'

export default function PostPage() {
  const params = useParams()
  const { user } = useUser()
  const slug = params.slug as string

  const [post, setPost] = useState<PostWithDetails | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<PostWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingRelated, setLoadingRelated] = useState(false)
  const [commentContent, setCommentContent] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)

  const fetchPost = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/posts/slug/${slug}`)
      if (response.ok) {
        const data = await response.json()
        setPost(data)
        // Buscar posts relacionados após carregar o post
        fetchRelatedPosts(data.id)
      } else {
        toast.error('Post não encontrado')
      }
    } catch (error) {
      console.error('Error fetching post:', error)
      toast.error('Erro ao carregar post')
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedPosts = async (postId: string) => {
    try {
      setLoadingRelated(true)
      const response = await fetch(`/api/posts/${postId}/related?limit=4`)
      if (response.ok) {
        const data = await response.json()
        setRelatedPosts(data.posts || [])
      }
    } catch (error) {
      console.error('Error fetching related posts:', error)
    } finally {
      setLoadingRelated(false)
    }
  }

  useEffect(() => {
    fetchPost()
  }, [slug])

  const handleSubmitComment = async () => {
    if (!user) {
      toast.error('Faça login para comentar')
      return
    }

    if (!commentContent.trim()) {
      toast.error('Digite um comentário')
      return
    }

    setSubmittingComment(true)

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: commentContent.trim(),
          postId: post?.id,
        }),
      })

      if (response.ok) {
        toast.success('Comentário enviado! Aguarde a moderação.')
        setCommentContent('')
        fetchPost() // Recarregar para mostrar comentários atualizados
      } else {
        const error = await response.json()
        toast.error(error.error || 'Erro ao enviar comentário')
      }
    } catch (error) {
      console.error('Error submitting comment:', error)
      toast.error('Erro ao enviar comentário')
    } finally {
      setSubmittingComment(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <p>Carregando post...</p>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post não encontrado</h1>
          <Link href="/blog">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao blog
            </Button>
          </Link>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/blog">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar aos posts
            </Button>
          </Link>
        </div>

        {/* Post Header */}
        <article className="bg-background rounded-lg shadow-sm border p-8 mb-8">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {post.category && (
                <Badge
                  variant="secondary"
                  style={{ backgroundColor: (post.category.color || '#6366f1') + '20', color: post.category.color || '#6366f1' }}
                >
                  {post.category.name}
                </Badge>
              )}
              {post.featured && <Badge variant="default">Destaque</Badge>}
              {post.tags.slice(0, 3).map((tag) => (
                <Badge key={tag.id} variant="outline">
                  {tag.name}
                </Badge>
              ))}
            </div>
            <h1 className="text-4xl font-bold mb-4">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="text-xl text-muted-foreground mb-6">
                {post.excerpt}
              </p>
            )}
          </div>

          {/* Author and Meta */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={post.author.imageUrl || undefined} />
                <AvatarFallback>
                  {post.author.firstName?.[0]}{post.author.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{post.author.firstName} {post.author.lastName}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <CalendarDays className="h-4 w-4" />
                    <span>{format(new Date(post.createdAt), 'dd MMM yyyy', { locale: ptBR })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{post._count.comments} comentários</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Heart className="h-4 w-4" />
                42
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" />
                Compartilhar
              </Button>
            </div>
          </div>

          <Separator className="mb-8" />

          {/* Post Content */}
          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br>') }} />
          </div>
        </article>

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Posts Relacionados
              </CardTitle>
              <CardDescription>
                Outros posts que podem interessar você
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingRelated ? (
                <div className="text-center py-8">
                  <p>Carregando posts relacionados...</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                        {relatedPost.coverImage && (
                          <div className="aspect-video overflow-hidden rounded-t-lg">
                            <img
                              src={relatedPost.coverImage}
                              alt={relatedPost.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <CardHeader>
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            {relatedPost.category && (
                              <Badge
                                variant="secondary"
                                style={{ backgroundColor: (relatedPost.category.color || '#6366f1') + '20', color: relatedPost.category.color || '#6366f1' }}
                              >
                                {relatedPost.category.name}
                              </Badge>
                            )}
                            {relatedPost.featured && <Badge variant="default">Destaque</Badge>}
                          </div>
                          <CardTitle className="line-clamp-2 text-lg">
                            {relatedPost.title}
                          </CardTitle>
                          {relatedPost.excerpt && (
                            <CardDescription className="line-clamp-2">
                              {relatedPost.excerpt}
                            </CardDescription>
                          )}
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={relatedPost.author.imageUrl || undefined} />
                                <AvatarFallback className="text-xs">
                                  {relatedPost.author.firstName?.[0]}{relatedPost.author.lastName?.[0]}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-muted-foreground">
                                {relatedPost.author.firstName} {relatedPost.author.lastName}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <CalendarDays className="h-4 w-4" />
                                <span>{format(new Date(relatedPost.createdAt), 'dd MMM', { locale: ptBR })}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageCircle className="h-4 w-4" />
                                <span>{relatedPost._count.comments}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Comments Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Comentários ({post._count.comments})
            </CardTitle>
            <CardDescription>
              Participe da discussão sobre este post
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Comment Form */}
            {user ? (
              <div className="space-y-4">
                <h3 className="font-medium">Deixe seu comentário</h3>
                <Textarea
                  placeholder="Escreva seu comentário aqui..."
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  rows={4}
                />
                <Button
                  onClick={handleSubmitComment}
                  disabled={submittingComment || !commentContent.trim()}
                  className="gap-2"
                >
                  <Send className="h-4 w-4" />
                  {submittingComment ? 'Enviando...' : 'Enviar comentário'}
                </Button>
              </div>
            ) : (
              <div className="text-center py-6 border rounded-lg">
                <p className="text-muted-foreground mb-4">
                  Faça login para deixar um comentário
                </p>
                <Link href="/sign-in">
                  <Button>Fazer login</Button>
                </Link>
              </div>
            )}

            {post.comments.length > 0 && <Separator />}

            {/* Comments List */}
            <div className="space-y-6">
              {post.comments.map((comment) => (
                <div key={comment.id} className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage src={comment.author.imageUrl || undefined} />
                      <AvatarFallback>
                        {comment.author.firstName?.[0]}{comment.author.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">
                          {comment.author.firstName} {comment.author.lastName}
                        </span>
                        {comment.author.id === post.author.id && (
                          <Badge variant="secondary" className="text-xs">Autor</Badge>
                        )}
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(comment.createdAt), 'dd MMM yyyy', { locale: ptBR })}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>
                  </div>

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-12 space-y-3">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex items-start gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={reply.author.imageUrl || undefined} />
                            <AvatarFallback>
                              {reply.author.firstName?.[0]}{reply.author.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">
                                {reply.author.firstName} {reply.author.lastName}
                              </span>
                              {reply.author.id === post.author.id && (
                                <Badge variant="secondary" className="text-xs">Autor</Badge>
                              )}
                              <span className="text-sm text-muted-foreground">
                                {format(new Date(reply.createdAt), 'dd MMM yyyy', { locale: ptBR })}
                              </span>
                            </div>
                            <p className="text-sm whitespace-pre-wrap">
                              {reply.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {post.comments.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Seja o primeiro a comentar!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
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
