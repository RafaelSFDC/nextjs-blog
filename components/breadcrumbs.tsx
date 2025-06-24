import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
  showHome?: boolean
}

export function Breadcrumbs({ 
  items, 
  className = '',
  showHome = true 
}: BreadcrumbsProps) {
  const allItems = showHome 
    ? [{ label: 'Início', href: '/' }, ...items]
    : items

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={cn('flex items-center space-x-1 text-sm text-muted-foreground', className)}
    >
      <ol className="flex items-center space-x-1">
        {allItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground/50" />
            )}
            
            {item.current || !item.href ? (
              <span 
                className={cn(
                  'font-medium',
                  item.current ? 'text-foreground' : 'text-muted-foreground'
                )}
                aria-current={item.current ? 'page' : undefined}
              >
                {index === 0 && showHome ? (
                  <Home className="h-4 w-4" />
                ) : (
                  item.label
                )}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-foreground transition-colors"
              >
                {index === 0 && showHome ? (
                  <Home className="h-4 w-4" />
                ) : (
                  item.label
                )}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

// Utility function to generate breadcrumbs from pathname
export function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = []

  segments.forEach((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/')
    const isLast = index === segments.length - 1
    
    // Format segment name
    let label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    // Special cases for known routes
    switch (segment) {
      case 'blog':
        label = 'Blog'
        break
      case 'about':
        label = 'Sobre'
        break
      case 'contact':
        label = 'Contato'
        break
      case 'dashboard':
        label = 'Dashboard'
        break
      case 'privacy':
        label = 'Privacidade'
        break
      case 'terms':
        label = 'Termos'
        break
    }

    breadcrumbs.push({
      label,
      href: isLast ? undefined : href,
      current: isLast
    })
  })

  return breadcrumbs
}

// Pre-built breadcrumb components for common pages
export function BlogBreadcrumbs({ 
  postTitle, 
  categoryName,
  categorySlug 
}: { 
  postTitle?: string
  categoryName?: string
  categorySlug?: string
}) {
  const items: BreadcrumbItem[] = [
    { label: 'Blog', href: '/blog' }
  ]

  if (categoryName && categorySlug) {
    items.push({
      label: categoryName,
      href: `/blog?categoryId=${categorySlug}`
    })
  }

  if (postTitle) {
    items.push({
      label: postTitle,
      current: true
    })
  }

  return <Breadcrumbs items={items} />
}

export function DashboardBreadcrumbs({ 
  section,
  subsection,
  item 
}: { 
  section?: string
  subsection?: string
  item?: string
}) {
  const items: BreadcrumbItem[] = [
    { label: 'Dashboard', href: '/dashboard' }
  ]

  if (section) {
    items.push({
      label: section,
      href: subsection ? `/dashboard/${section.toLowerCase()}` : undefined,
      current: !subsection && !item
    })
  }

  if (subsection) {
    items.push({
      label: subsection,
      href: item ? `/dashboard/${section?.toLowerCase()}/${subsection.toLowerCase()}` : undefined,
      current: !item
    })
  }

  if (item) {
    items.push({
      label: item,
      current: true
    })
  }

  return <Breadcrumbs items={items} />
}
