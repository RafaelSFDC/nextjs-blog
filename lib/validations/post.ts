import { z } from 'zod'
import { PostStatus } from '@prisma/client'

export const postSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(200, 'Título deve ter no máximo 200 caracteres'),
  slug: z.string().min(1, 'Slug é obrigatório').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug deve conter apenas letras minúsculas, números e hífens'),
  excerpt: z.string().max(500, 'Resumo deve ter no máximo 500 caracteres').optional(),
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  coverImage: z.string().url('URL da imagem inválida').optional().or(z.literal('')),
  categoryId: z.string().optional(),
  tagIds: z.array(z.string()).default([]),
  status: z.nativeEnum(PostStatus).default(PostStatus.DRAFT),
  featured: z.boolean().default(false),
  publishedAt: z.date().optional(),
})

export const categorySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome deve ter no máximo 100 caracteres'),
  slug: z.string().min(1, 'Slug é obrigatório').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug deve conter apenas letras minúsculas, números e hífens'),
  description: z.string().max(500, 'Descrição deve ter no máximo 500 caracteres').optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor deve estar no formato hexadecimal').optional(),
})

export const tagSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(50, 'Nome deve ter no máximo 50 caracteres'),
  slug: z.string().min(1, 'Slug é obrigatório').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug deve conter apenas letras minúsculas, números e hífens'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor deve estar no formato hexadecimal').optional(),
})

export const commentSchema = z.object({
  content: z.string().min(1, 'Comentário é obrigatório').max(1000, 'Comentário deve ter no máximo 1000 caracteres'),
  postId: z.string().min(1, 'ID do post é obrigatório'),
  parentId: z.string().optional(),
})

export const searchSchema = z.object({
  query: z.string().optional(),
  categoryId: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
  status: z.nativeEnum(PostStatus).optional(),
  featured: z.boolean().optional(),
  authorId: z.string().optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'publishedAt', 'title']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
})

export type PostFormData = z.infer<typeof postSchema>
export type CategoryFormData = z.infer<typeof categorySchema>
export type TagFormData = z.infer<typeof tagSchema>
export type CommentFormData = z.infer<typeof commentSchema>
export type SearchFilters = z.infer<typeof searchSchema>
