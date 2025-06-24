import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getCategories } from '@/app/actions/categories'
import { getTags } from '@/app/actions/tags'
import { NewPostForm } from './new-post-form'

export default async function NewPostPage() {
  // Buscar dados em paralelo
  const [categories, tags] = await Promise.all([
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
            <h1 className="text-2xl font-bold">Novo Post</h1>
          </div>
        </div>
      </header>

      <NewPostForm categories={categories} tags={tags} />
    </div>
  )
}
