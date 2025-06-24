'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react'
import { PostWithDetails } from '@/types/blog'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface PostActionsDropdownProps {
  post: PostWithDetails
}

export function PostActionsDropdown({ post }: PostActionsDropdownProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja deletar este post?')) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Post deletado com sucesso!')
        router.refresh()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Erro ao deletar post')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      toast.error('Erro ao deletar post')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" disabled={isDeleting}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/blog/${post.slug}`}>
            <Eye className="h-4 w-4 mr-2" />
            Visualizar
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/posts/${post.id}/edit`}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleDelete}
          className="text-destructive"
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          {isDeleting ? 'Deletando...' : 'Deletar'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
