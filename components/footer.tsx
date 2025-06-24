import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { Github, Linkedin, Mail, Twitter, Heart, Code2, ArrowUp } from 'lucide-react'

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-16">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                <Code2 className="h-4 w-4 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-bold">Meu Blog</h3>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Compartilhando conhecimento sobre desenvolvimento, tecnologia e experiências pessoais.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                  <span className="sr-only">GitHub</span>
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4" />
                  <span className="sr-only">LinkedIn</span>
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-4 w-4" />
                  <span className="sr-only">Twitter</span>
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <a href="mailto:contato@exemplo.com">
                  <Mail className="h-4 w-4" />
                  <span className="sr-only">Email</span>
                </a>
              </Button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Navegação</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                  Posts
                </Link>
              </li>
              <li>
                <Link href="/#sobre" className="text-muted-foreground hover:text-foreground transition-colors">
                  Sobre
                </Link>
              </li>
              <li>
                <Link href="/#contato" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Categorias</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blog?category=tecnologia" className="text-muted-foreground hover:text-foreground transition-colors">
                  Tecnologia
                </Link>
              </li>
              <li>
                <Link href="/blog?category=desenvolvimento" className="text-muted-foreground hover:text-foreground transition-colors">
                  Desenvolvimento
                </Link>
              </li>
              <li>
                <Link href="/blog?category=carreira" className="text-muted-foreground hover:text-foreground transition-colors">
                  Carreira
                </Link>
              </li>
              <li>
                <Link href="/blog?category=pessoal" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pessoal
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Newsletter</h4>
            <p className="text-sm text-muted-foreground">
              Receba os últimos posts diretamente no seu email.
            </p>
            <div className="space-y-2">
              <Input 
                type="email" 
                placeholder="Seu email" 
                className="h-8 text-sm"
              />
              <Button size="sm" className="w-full">
                Inscrever-se
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Sem spam. Apenas conteúdo de qualidade.
            </p>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Bottom Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <span>&copy; 2025 Meu Blog. Feito com</span>
            <Heart className="h-3 w-3 text-red-500 fill-current" />
            <span>usando Next.js, Prisma e Clerk.</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacidade
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Termos
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={scrollToTop}
            >
              <ArrowUp className="h-4 w-4" />
              <span className="sr-only">Voltar ao topo</span>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}
