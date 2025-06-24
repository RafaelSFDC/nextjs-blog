'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, X, Filter } from 'lucide-react'
import { useSearchFilters } from '@/lib/hooks/use-search-params'
import { CategoryWithCount } from '@/types/blog'
import { PostStatus } from '@prisma/client'
import { useDebounce } from '@/lib/hooks/use-debounce'

interface SearchFiltersProps {
  categories: CategoryWithCount[]
  showStatusFilter?: boolean
  showFeaturedFilter?: boolean
  showSortOptions?: boolean
}

export function SearchFilters({
  categories,
  showStatusFilter = false,
  showFeaturedFilter = false,
  showSortOptions = false
}: SearchFiltersProps) {
  const { filters, setQuery, setCategory, setStatus, setFeatured, setSorting } = useSearchFilters()

  const [searchInput, setSearchInput] = useState(filters.query)
  const debouncedSearch = useDebounce(searchInput, 500)

  // Update URL when debounced search changes
  useEffect(() => {
    setQuery(debouncedSearch || '')
  }, [debouncedSearch, setQuery])

  // Sync input with URL params (for back/forward navigation)
  useEffect(() => {
    setSearchInput(filters.query)
  }, [filters.query])

  const hasActiveFilters = filters.query ||
    filters.categoryId !== 'all' ||
    filters.status !== 'all' ||
    filters.featured

  const clearFilters = () => {
    setSearchInput('')
    setQuery('')
    setCategory('all')
    setStatus('all')
    setFeatured(null)
  }

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar posts..."
          className="pl-10"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          <Badge
            variant={filters.categoryId === 'all' ? "default" : "outline"}
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
            onClick={() => setCategory('all')}
          >
            Todos
          </Badge>
          {categories.map((category) => (
            <Badge
              key={category.id}
              variant={filters.categoryId === category.id ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
              onClick={() => setCategory(category.id)}
              style={{
                backgroundColor: filters.categoryId === category.id ? (category.color || undefined) : undefined,
                borderColor: category.color || undefined
              }}
            >
              {category.name} ({category._count.posts})
            </Badge>
          ))}
        </div>

        {/* Status Filter */}
        {showStatusFilter && (
          <Select value={filters.status} onValueChange={setStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value={PostStatus.PUBLISHED}>Publicado</SelectItem>
              <SelectItem value={PostStatus.DRAFT}>Rascunho</SelectItem>
              <SelectItem value={PostStatus.ARCHIVED}>Arquivado</SelectItem>
            </SelectContent>
          </Select>
        )}

        {/* Featured Filter */}
        {showFeaturedFilter && (
          <div className="flex gap-2">
            <Badge
              variant={!filters.featured ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
              onClick={() => setFeatured(null)}
            >
              Todos
            </Badge>
            <Badge
              variant={filters.featured ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
              onClick={() => setFeatured(true)}
            >
              Em Destaque
            </Badge>
          </div>
        )}

        {/* Sort Options */}
        {showSortOptions && (
          <div className="flex gap-2">
            <Select
              value={filters.sortBy}
              onValueChange={(value) => setSorting(value, filters.sortOrder)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Data de Criação</SelectItem>
                <SelectItem value="publishedAt">Data de Publicação</SelectItem>
                <SelectItem value="title">Título</SelectItem>
                <SelectItem value="updatedAt">Última Atualização</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.sortOrder}
              onValueChange={(value) => setSorting(filters.sortBy, value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Decrescente</SelectItem>
                <SelectItem value="asc">Crescente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Limpar Filtros
          </Button>
        )}
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>Filtros ativos:</span>
          {filters.query && (
            <Badge variant="secondary">
              Busca: "{filters.query}"
            </Badge>
          )}
          {filters.categoryId !== 'all' && (
            <Badge variant="secondary">
              Categoria: {categories.find(c => c.id === filters.categoryId)?.name}
            </Badge>
          )}
          {filters.status !== 'all' && (
            <Badge variant="secondary">
              Status: {filters.status}
            </Badge>
          )}
          {filters.featured && (
            <Badge variant="secondary">
              Em Destaque
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
