'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import { MessageCircle, Send } from 'lucide-react'
import { PostWithDetails } from '@/types/blog'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useUser } from '@clerk/nextjs'
import { toast } from 'sonner'
import { createComment } from '@/app/actions/comments'
import { useRouter } from 'next/navigation'

interface CommentSectionProps {
  post: PostWithDetails
}

export function CommentSection({ post }: CommentSectionProps) {
  const { user } = useUser()
  const router = useRouter()
  const [commentContent, setCommentContent] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)

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
      const formData = new FormData()
      formData.append('content', commentContent.trim())
      formData.append('postId', post.id)

      await createComment(formData)

      toast.success('Comentário enviado! Aguarde a moderação.')
      setCommentContent('')
      router.refresh() // Recarregar para mostrar comentários atualizados
    } catch (error) {
      console.error('Error submitting comment:', error)
      toast.error(error instanceof Error ? error.message : 'Erro ao enviar comentário')
    } finally {
      setSubmittingComment(false)
    }
  }

  return (
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

        {post.comments && post.comments.length > 0 && <Separator />}

        {/* Comments List */}
        <div className="space-y-6">
          {post.comments?.map((comment) => (
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

          {(!post.comments || post.comments.length === 0) && (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Seja o primeiro a comentar!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
