import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getPostById } from '@/app/actions/posts'
import { getCategories } from '@/app/actions/categories'
import { getTags } from '@/app/actions/tags'
import { notFound } from 'next/navigation'
import { EditPostForm } from './edit-post-form'

export const dynamic = 'force-dynamic'

interface EditPostPageProps {
  params: Promise<{ id: string }>
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params

  try {
    // Buscar dados em paralelo
    const [post, categories, tags] = await Promise.all([
      getPostById(id),
      getCategories(),
      getTags()
    ])

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
              <h1 className="text-2xl font-bold">Editar Post</h1>
            </div>
          </div>
        </header>

        <EditPostForm
          post={post}
          categories={categories}
          tags={tags}
        />
      </div>
    )
  } catch (error) {
    console.error('Error loading post:', error)
    notFound()
  }
}
