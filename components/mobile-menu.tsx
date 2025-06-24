"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { Menu, Github, Linkedin, Mail, Home, BookOpen, User, MessageCircle } from 'lucide-react'

export function MobileMenu() {
  const [open, setOpen] = useState(false)

  const closeMenu = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>
            Navegue pelo blog
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Navigation Links */}
          <div className="space-y-3">
            <Link href="/" onClick={closeMenu}>
              <Button variant="ghost" className="w-full justify-start gap-3">
                <Home className="h-4 w-4" />
                Início
              </Button>
            </Link>
            <Link href="/blog" onClick={closeMenu}>
              <Button variant="ghost" className="w-full justify-start gap-3">
                <BookOpen className="h-4 w-4" />
                Posts
              </Button>
            </Link>
            <Link href="/about" onClick={closeMenu}>
              <Button variant="ghost" className="w-full justify-start gap-3">
                <User className="h-4 w-4" />
                Sobre
              </Button>
            </Link>
            <Link href="/contact" onClick={closeMenu}>
              <Button variant="ghost" className="w-full justify-start gap-3">
                <MessageCircle className="h-4 w-4" />
                Contato
              </Button>
            </Link>
          </div>

          <Separator />

          {/* Social Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Conecte-se</h4>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start gap-3" asChild>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" onClick={closeMenu}>
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3" asChild>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" onClick={closeMenu}>
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3" asChild>
                <a href="mailto:contato@exemplo.com" onClick={closeMenu}>
                  <Mail className="h-4 w-4" />
                  Email
                </a>
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
