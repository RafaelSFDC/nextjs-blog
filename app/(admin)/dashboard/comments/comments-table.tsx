'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  MoreHorizontal, 
  Check, 
  X, 
  Trash2,
  Calendar,
  User,
  ExternalLink
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from 'sonner'
import { updateComment, deleteComment } from '@/app/actions/comments'
import { CommentStatus } from '@prisma/client'

interface CommentWithPost {
  id: string
  content: string
  status: CommentStatus
  createdAt: Date
  author: {
    id: string
    firstName: string | null
    lastName: string | null
  }
  post: {
    id: string
    title: string
    slug: string
  }
}

interface CommentsTableProps {
  comments: CommentWithPost[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
  currentStatus?: CommentStatus
}

export function CommentsTable({ comments, pagination, currentStatus }: CommentsTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loadingActions, setLoadingActions] = useState<Record<string, boolean>>({})

  const handleStatusChange = async (commentId: string, status: CommentStatus) => {
    setLoadingActions(prev => ({ ...prev, [commentId]: true }))
    
    try {
      const formData = new FormData()
      formData.append('status', status)
      
      await updateComment(commentId, formData)
      
      toast.success(`Comentário ${status === 'APPROVED' ? 'aprovado' : 'rejeitado'}!`)
      router.refresh()
    } catch (error) {
      console.error('Error updating comment:', error)
      toast.error(error instanceof Error ? error.message : 'Erro ao atualizar comentário')
    } finally {
      setLoadingActions(prev => ({ ...prev, [commentId]: false }))
    }
  }

  const handleDelete = async (commentId: string) => {
    if (!confirm('Tem certeza que deseja deletar este comentário?')) {
      return
    }

    setLoadingActions(prev => ({ ...prev, [commentId]: true }))

    try {
      await deleteComment(commentId)
      toast.success('Comentário deletado!')
      router.refresh()
    } catch (error) {
      console.error('Error deleting comment:', error)
      toast.error(error instanceof Error ? error.message : 'Erro ao deletar comentário')
    } finally {
      setLoadingActions(prev => ({ ...prev, [commentId]: false }))
    }
  }

  const handleStatusFilterChange = (status: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (status === 'all') {
      params.delete('status')
    } else {
      params.set('status', status)
    }
    
    params.delete('page') // Reset to first page when changing filter
    
    router.push(`/dashboard/comments?${params.toString()}`)
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    router.push(`/dashboard/comments?${params.toString()}`)
  }

  const getStatusBadge = (status: CommentStatus) => {
    switch (status) {
      case 'APPROVED':
        return <Badge variant="default">Aprovado</Badge>
      case 'PENDING':
        return <Badge variant="secondary">Pendente</Badge>
      case 'REJECTED':
        return <Badge variant="destructive">Rejeitado</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select 
          value={currentStatus || 'all'} 
          onValueChange={handleStatusFilterChange}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="PENDING">Pendentes</SelectItem>
            <SelectItem value="APPROVED">Aprovados</SelectItem>
            <SelectItem value="REJECTED">Rejeitados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabela */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Comentário</TableHead>
              <TableHead>Autor</TableHead>
              <TableHead>Post</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="w-[70px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comments.map((comment) => (
              <TableRow key={comment.id}>
                <TableCell>
                  <div className="max-w-md">
                    <p className="text-sm line-clamp-3">
                      {comment.content}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {comment.author.firstName} {comment.author.lastName}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs">
                    <Link 
                      href={`/blog/${comment.post.slug}`}
                      className="text-sm hover:underline flex items-center gap-1"
                    >
                      <span className="truncate">{comment.post.title}</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(comment.status)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {format(new Date(comment.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        disabled={loadingActions[comment.id]}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {comment.status !== 'APPROVED' && (
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(comment.id, 'APPROVED')}
                          className="text-green-600"
                          disabled={loadingActions[comment.id]}
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Aprovar
                        </DropdownMenuItem>
                      )}
                      {comment.status !== 'REJECTED' && (
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(comment.id, 'REJECTED')}
                          className="text-orange-600"
                          disabled={loadingActions[comment.id]}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Rejeitar
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => handleDelete(comment.id)}
                        className="text-destructive"
                        disabled={loadingActions[comment.id]}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Deletar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Página {pagination.page} de {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={!pagination.hasPrev}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!pagination.hasNext}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
