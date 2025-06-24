"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ScrollToTopProps {
  threshold?: number
  className?: string
  variant?: 'fixed' | 'inline'
}

export function ScrollToTop({
  threshold = 300,
  className = '',
  variant = 'inline'
}: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > threshold) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [threshold])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  if (variant === 'fixed') {
    return (
      <Button
        variant="default"
        size="icon"
        className={cn(
          'fixed bottom-8 right-8 z-50 h-12 w-12 rounded-full shadow-lg transition-all duration-300',
          isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-2 pointer-events-none',
          className
        )}
        onClick={scrollToTop}
        aria-label="Voltar ao topo"
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn('h-8 w-8', className)}
      onClick={scrollToTop}
      aria-label="Voltar ao topo"
    >
      <ArrowUp className="h-4 w-4" />
    </Button>
  )
}
