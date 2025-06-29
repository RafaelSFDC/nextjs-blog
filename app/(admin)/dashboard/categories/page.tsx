import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getCategories } from '@/app/actions/categories'
import { CategoriesClient } from './categories-client'

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
  const categories = await getCategories(true)

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
            <h1 className="text-2xl font-bold">Categorias</h1>
          </div>
        </div>
      </header>

      <CategoriesClient initialCategories={categories} />
    </div>
  )
}
