import { User, Post, Category, Tag, Comment, UserRole, PostStatus, CommentStatus } from '@prisma/client'

export type { User, Post, Category, Tag, Comment, UserRole, PostStatus, CommentStatus }

export interface PostWithDetails extends Post {
  author: User | {
    id: string
    firstName: string | null
    lastName: string | null
    imageUrl: string | null
    email?: string
  }
  category: Category | null
  tags: Tag[]
  comments?: CommentWithAuthor[]
  _count: {
    comments: number
  }
}

export interface CommentWithAuthor extends Comment {
  author: User | {
    id: string
    firstName: string | null
    lastName: string | null
    imageUrl: string | null
  }
  replies?: CommentWithAuthor[]
}

export interface CategoryWithCount extends Category {
  _count: {
    posts: number
  }
}

export interface TagWithCount extends Tag {
  _count: {
    posts: number
  }
}

export interface PostFormData {
  title: string
  slug: string
  excerpt?: string
  content: string
  coverImage?: string
  categoryId?: string
  tagIds: string[]
  status: PostStatus
  featured: boolean
  publishedAt?: Date
}

export interface CategoryFormData {
  name: string
  slug: string
  description?: string
  color?: string
}

export interface TagFormData {
  name: string
  slug: string
  color?: string
}

export interface CommentFormData {
  content: string
  postId: string
  parentId?: string
}

export interface BlogStats {
  totalPosts: number
  totalPublishedPosts: number
  totalDraftPosts: number
  totalCategories: number
  totalTags: number
  totalComments: number
  totalUsers: number
  pendingComments: number
  recentPosts: Array<{
    id: string
    title: string
    slug: string
    status: string
    createdAt: Date
    author: {
      firstName: string | null
      lastName: string | null
    }
    category: {
      name: string
    } | null
    _count: {
      comments: number
    }
  }>
  recentComments: Array<{
    id: string
    content: string
    status: string
    createdAt: Date
    author: {
      firstName: string | null
      lastName: string | null
    }
    post: {
      title: string
      slug: string
    }
  }>
  monthlyData: Array<{
    month: string
    posts: number
  }>
}

export interface SearchFilters {
  query?: string
  categoryId?: string
  tagIds?: string[]
  status?: PostStatus
  featured?: boolean
  authorId?: string
  sortBy?: 'createdAt' | 'updatedAt' | 'publishedAt' | 'title'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface PaginatedResult<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}
