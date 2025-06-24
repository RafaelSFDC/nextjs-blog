'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'

export function useSearchParamsState() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateSearchParams = useCallback((updates: Record<string, string | number | boolean | null | undefined>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '' || value === 'all') {
        params.delete(key)
      } else {
        params.set(key, String(value))
      }
    })

    // Reset page to 1 when filters change (except when updating page itself)
    if (!updates.hasOwnProperty('page') && Object.keys(updates).length > 0) {
      params.delete('page')
    }

    const newUrl = `${pathname}?${params.toString()}`
    router.push(newUrl, { scroll: false })
  }, [router, pathname, searchParams])

  const getParam = useCallback((key: string, defaultValue?: string) => {
    return searchParams.get(key) || defaultValue
  }, [searchParams])

  const getParamAsNumber = useCallback((key: string, defaultValue: number = 1) => {
    const value = searchParams.get(key)
    return value ? parseInt(value, 10) : defaultValue
  }, [searchParams])

  const getParamAsBoolean = useCallback((key: string) => {
    return searchParams.get(key) === 'true'
  }, [searchParams])

  const getParamAsArray = useCallback((key: string) => {
    const value = searchParams.get(key)
    return value ? value.split(',') : []
  }, [searchParams])

  const clearAllParams = useCallback(() => {
    router.push(pathname, { scroll: false })
  }, [router, pathname])

  return {
    updateSearchParams,
    getParam,
    getParamAsNumber,
    getParamAsBoolean,
    getParamAsArray,
    clearAllParams,
    searchParams,
  }
}

export function useSearchFilters() {
  const {
    updateSearchParams,
    getParam,
    getParamAsNumber,
    getParamAsBoolean,
    getParamAsArray,
  } = useSearchParamsState()

  const filters = {
    query: getParam('query', ''),
    categoryId: getParam('categoryId', 'all'),
    tagIds: getParamAsArray('tagIds'),
    status: getParam('status', 'all'),
    featured: getParamAsBoolean('featured'),
    authorId: getParam('authorId'),
    sortBy: getParam('sortBy', 'createdAt') as 'createdAt' | 'updatedAt' | 'publishedAt' | 'title',
    sortOrder: getParam('sortOrder', 'desc') as 'asc' | 'desc',
    page: getParamAsNumber('page', 1),
    limit: getParamAsNumber('limit', 10),
  }

  const updateFilter = (key: string, value: string | number | boolean | string[] | null) => {
    if (Array.isArray(value)) {
      updateSearchParams({ [key]: value.length > 0 ? value.join(',') : null })
    } else {
      updateSearchParams({ [key]: value })
    }
  }

  const setQuery = (query: string) => updateFilter('query', query)
  const setCategory = (categoryId: string) => updateFilter('categoryId', categoryId === 'all' ? null : categoryId)
  const setTags = (tagIds: string[]) => updateFilter('tagIds', tagIds)
  const setStatus = (status: string) => updateFilter('status', status === 'all' ? null : status)
  const setFeatured = (featured: boolean | null) => updateFilter('featured', featured)
  const setAuthor = (authorId: string | null) => updateFilter('authorId', authorId)
  const setSorting = (sortBy: string, sortOrder: string) => {
    updateSearchParams({ sortBy, sortOrder })
  }
  const setPage = (page: number) => updateFilter('page', page === 1 ? null : page)
  const setLimit = (limit: number) => updateFilter('limit', limit === 10 ? null : limit)

  return {
    filters,
    setQuery,
    setCategory,
    setTags,
    setStatus,
    setFeatured,
    setAuthor,
    setSorting,
    setPage,
    setLimit,
    updateSearchParams,
  }
}
