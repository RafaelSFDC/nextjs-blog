import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft, MessageCircle } from 'lucide-react'
import { getComments } from '@/app/actions/comments'
import { CommentStatus } from '@prisma/client'
import { CommentsTable } from './comments-table'

interface CommentsPageProps {
  searchParams: Promise<{
    status?: CommentStatus
    page?: string
  }>
}

export default async function CommentsPage({ searchParams }: CommentsPageProps) {
  const params = await searchParams
  const status = params.status
  const page = parseInt(params.page || '1')

  const result = await getComments({
    status,
    page,
    limit: 10
  })

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
            <h1 className="text-2xl font-bold">Comentários</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Moderar Comentários</CardTitle>
            <CardDescription>
              Aprove, rejeite ou delete comentários dos posts
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result.comments.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum comentário encontrado</p>
              </div>
            ) : (
              <CommentsTable
                comments={result.comments}
                pagination={result.pagination}
                currentStatus={status}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
