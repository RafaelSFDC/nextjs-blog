"use client"

import { Button } from '@/components/ui/button'
import { ArrowUp } from 'lucide-react'

export function ScrollToTop() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="h-8 w-8"
      onClick={scrollToTop}
    >
      <ArrowUp className="h-4 w-4" />
      <span className="sr-only">Voltar ao topo</span>
    </Button>
  )
}
