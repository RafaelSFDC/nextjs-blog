'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  PlusCircle,
  MoreHorizontal,
  Edit,
  Trash2,
  Tag as TagIcon
} from 'lucide-react'
import { CategoryWithCount } from '@/types/blog'
import { toast } from 'sonner'
import { createCategory, updateCategory, deleteCategory } from '@/app/actions/categories'
import { useRouter } from 'next/navigation'

interface CategoriesClientProps {
  initialCategories: CategoryWithCount[]
}

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function CategoriesClient({ initialCategories }: CategoriesClientProps) {
  const router = useRouter()
  const [categories, setCategories] = useState<CategoryWithCount[]>(initialCategories)
  const [saving, setSaving] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryWithCount | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Form state
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState('#6366f1')

  const handleNameChange = (value: string) => {
    setName(value)
    if (!slug || slug === generateSlug(name)) {
      setSlug(generateSlug(value))
    }
  }

  const resetForm = () => {
    setName('')
    setSlug('')
    setDescription('')
    setColor('#6366f1')
    setEditingCategory(null)
  }

  const openCreateDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const openEditDialog = (category: CategoryWithCount) => {
    setEditingCategory(category)
    setName(category.name)
    setSlug(category.slug)
    setDescription(category.description || '')
    setColor(category.color || '#6366f1')
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!name.trim() || !slug.trim()) {
      toast.error('Nome e slug são obrigatórios')
      return
    }

    setSaving(true)

    try {
      const formData = new FormData()
      formData.append('name', name.trim())
      formData.append('slug', slug.trim())
      formData.append('description', description.trim())
      formData.append('color', color)

      if (editingCategory) {
        await updateCategory(editingCategory.id, formData)
        toast.success('Categoria atualizada!')
      } else {
        await createCategory(formData)
        toast.success('Categoria criada!')
      }

      setIsDialogOpen(false)
      resetForm()
      router.refresh()
    } catch (error) {
      console.error('Error saving category:', error)
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar categoria')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (category: CategoryWithCount) => {
    if (category._count.posts > 0) {
      toast.error('Não é possível deletar categoria que possui posts')
      return
    }

    if (!confirm(`Tem certeza que deseja deletar a categoria "${category.name}"?`)) {
      return
    }

    try {
      await deleteCategory(category.id)
      toast.success('Categoria deletada!')
      router.refresh()
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error(error instanceof Error ? error.message : 'Erro ao deletar categoria')
    }
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Gerenciar Categorias</CardTitle>
                <CardDescription>
                  Organize seus posts em categorias para facilitar a navegação
                </CardDescription>
              </div>
              <Button className="gap-2" onClick={openCreateDialog}>
                <PlusCircle className="h-4 w-4" />
                Nova Categoria
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {categories.length === 0 ? (
              <div className="text-center py-8">
                <TagIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Nenhuma categoria encontrada</p>
                <Button onClick={openCreateDialog}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Criar primeira categoria
                </Button>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Posts</TableHead>
                      <TableHead>Cor</TableHead>
                      <TableHead className="w-[70px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full border"
                              style={{ backgroundColor: category.color || '#6366f1' }}
                            />
                            <div>
                              <div className="font-medium">{category.name}</div>
                              {category.description && (
                                <div className="text-sm text-muted-foreground line-clamp-1">
                                  {category.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-sm bg-muted px-2 py-1 rounded">
                            {category.slug}
                          </code>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {category._count.posts} posts
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded-full border"
                              style={{ backgroundColor: category.color || '#6366f1' }}
                            />
                            <span className="text-sm text-muted-foreground">
                              {category.color}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditDialog(category)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(category)}
                                className="text-destructive"
                                disabled={category._count.posts > 0}
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
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? 'Atualize as informações da categoria'
                : 'Crie uma nova categoria para organizar seus posts'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Nome da categoria..."
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="slug-da-categoria"
              />
            </div>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrição da categoria..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="color">Cor</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="color"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-16 h-10"
                />
                <Input
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="#6366f1"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Salvando...' : editingCategory ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
