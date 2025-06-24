import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { CalendarDays, ArrowLeft, Share2, Heart, MessageCircle } from 'lucide-react'
import { PostWithDetails } from '@/types/blog'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { getPostBySlug, getRelatedPosts } from '@/app/actions/posts'
import { notFound } from 'next/navigation'
import { CommentSection } from './comment-section'

interface PostPageProps {
  params: Promise<{ slug: string }>
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params

  try {
    // Buscar post e posts relacionados em paralelo
    const post = await getPostBySlug(slug)
    const relatedPosts = await getRelatedPosts(post.id, 4)

    return <PostContent post={post} relatedPosts={relatedPosts} />
  } catch (error) {
    console.error('Error fetching post:', error)
    notFound()
  }
}

function PostContent({
  post,
  relatedPosts
}: {
  post: PostWithDetails
  relatedPosts: PostWithDetails[]
}) {
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
            </CardContent>
          </Card>
        )}

        {/* Comments Section */}
        <CommentSection post={post} />
      </div>

      <Footer />
    </div>
  )
}
