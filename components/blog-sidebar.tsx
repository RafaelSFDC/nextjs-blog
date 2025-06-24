'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Calendar, TrendingUp, Tag, BookOpen } from 'lucide-react'
import { CategoryWithCount } from '@/types/blog'
import { useSearchFilters } from '@/lib/hooks/use-search-params'

interface BlogSidebarProps {
  categories: CategoryWithCount[]
}

export function BlogSidebar({ categories }: BlogSidebarProps) {
  const { setCategory } = useSearchFilters()

  // Get top categories (sorted by post count)
  const topCategories = categories
    .filter(cat => cat._count.posts > 0)
    .sort((a, b) => b._count.posts - a._count.posts)
    .slice(0, 6)

  return (
    <div className="space-y-6">
      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Tag className="h-5 w-5" />
            Categorias Populares
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {topCategories.map((category) => (
            <Link key={category.id} href={`/category/${category.slug}`}>
              <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color || '#6366f1' }}
                  />
                  <span className="font-medium">{category.name}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {category._count.posts}
                </Badge>
              </div>
            </Link>
          ))}

          {categories.length > 6 && (
            <Link href="/blog?categoryId=all">
              <Button variant="outline" size="sm" className="w-full mt-3">
                Ver todas as categorias
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5" />
            Estatísticas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Total de Posts</span>
            </div>
            <Badge variant="secondary">
              {categories.reduce((total, cat) => total + cat._count.posts, 0)}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Categorias</span>
            </div>
            <Badge variant="secondary">
              {categories.length}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Newsletter CTA */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">📧 Newsletter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Receba os melhores posts diretamente no seu email
          </p>
          <Button className="w-full" size="sm">
            Inscrever-se
          </Button>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sobre o Blog</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Compartilho conhecimento sobre desenvolvimento web, tecnologia e experiências
            pessoais na área de programação.
          </p>
          <Link href="/#sobre">
            <Button variant="outline" size="sm" className="w-full mt-3">
              Saiba mais
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
