'use client'

import { useEffect, useState } from 'react'
import { Progress } from '@/components/ui/progress'

interface ReadingProgressProps {
  target?: string
  className?: string
}

export function ReadingProgress({ target = 'article', className = '' }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const article = document.querySelector(target) as HTMLElement
      if (!article) return

      const articleTop = article.offsetTop
      const articleHeight = article.offsetHeight
      const windowHeight = window.innerHeight
      const scrollTop = window.scrollY

      // Calculate how much of the article has been scrolled through
      const articleBottom = articleTop + articleHeight
      const windowBottom = scrollTop + windowHeight

      if (scrollTop < articleTop) {
        // Haven't reached the article yet
        setProgress(0)
      } else if (windowBottom > articleBottom) {
        // Scrolled past the article
        setProgress(100)
      } else {
        // Currently reading the article
        const scrolledIntoArticle = scrollTop - articleTop
        const totalScrollableHeight = articleHeight - windowHeight
        const progressPercentage = Math.min(
          (scrolledIntoArticle / totalScrollableHeight) * 100,
          100
        )
        setProgress(Math.max(progressPercentage, 0))
      }
    }

    // Update on scroll
    window.addEventListener('scroll', updateProgress)
    // Update on resize
    window.addEventListener('resize', updateProgress)
    // Initial update
    updateProgress()

    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [target])

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${className}`}>
      <Progress
        value={progress}
        className="h-1 rounded-none border-none bg-transparent"
      />
    </div>
  )
}

// Alternative sticky version that shows reading time and progress
export function ReadingProgressSticky({
  target = 'article',
  readingTime = 5,
  title = '',
  className = ''
}: ReadingProgressProps & {
  readingTime?: number
  title?: string
}) {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const updateProgress = () => {
      const article = document.querySelector(target) as HTMLElement
      if (!article) return

      const articleTop = article.offsetTop
      const articleHeight = article.offsetHeight
      const windowHeight = window.innerHeight
      const scrollTop = window.scrollY

      // Show the progress bar when user starts reading
      setIsVisible(scrollTop > articleTop - 100)

      const articleBottom = articleTop + articleHeight
      const windowBottom = scrollTop + windowHeight

      if (scrollTop < articleTop) {
        setProgress(0)
      } else if (windowBottom > articleBottom) {
        setProgress(100)
      } else {
        const scrolledIntoArticle = scrollTop - articleTop
        const totalScrollableHeight = articleHeight - windowHeight
        const progressPercentage = Math.min(
          (scrolledIntoArticle / totalScrollableHeight) * 100,
          100
        )
        setProgress(Math.max(progressPercentage, 0))
      }
    }

    window.addEventListener('scroll', updateProgress)
    window.addEventListener('resize', updateProgress)
    updateProgress()

    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [target])

  if (!isVisible) return null

  return (
    <div className={`fixed top-16 left-4 right-4 z-40 ${className}`}>
      <div className="mx-auto max-w-4xl">
        <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-lg p-3 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1 min-w-0">
              {title && (
                <h3 className="text-sm font-medium truncate">{title}</h3>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{Math.round(progress)}%</span>
              <span>•</span>
              <span>{readingTime} min</span>
            </div>
          </div>
          <Progress value={progress} className="h-1" />
        </div>
      </div>
    </div>
  )
}
