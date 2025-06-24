import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { CalendarDays, User, ArrowLeft, Share2, Heart, MessageCircle } from 'lucide-react'

interface PostPageProps {
  params: {
    slug: string
  }
}

export default function PostPage({ params }: PostPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold">Blog</h1>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link href="/blog">
              <Button variant="ghost">Posts</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/sign-in">
              <Button>Entrar</Button>
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/blog">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar aos posts
            </Button>
          </Link>
        </div>

        {/* Post Header */}
        <article className="bg-background rounded-lg shadow-sm border p-8 mb-8">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">Tecnologia</Badge>
              <Badge variant="default">Destaque</Badge>
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Como construir um blog moderno com Next.js
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Aprenda a criar um blog completo usando as melhores tecnologias 
              do mercado, incluindo Next.js, Prisma e Clerk para autenticação.
            </p>
          </div>

          {/* Author and Meta */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Admin</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <CalendarDays className="h-4 w-4" />
                    <span>24 Jun 2025</span>
                  </div>
                  <span>5 min de leitura</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Heart className="h-4 w-4" />
                42
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" />
                Compartilhar
              </Button>
            </div>
          </div>

          <Separator className="mb-8" />

          {/* Post Content */}
          <div className="prose prose-lg max-w-none">
            <p>
              Neste tutorial, vamos aprender como criar um blog moderno e completo 
              usando Next.js 15, Prisma como ORM e Clerk para autenticação. 
              Este projeto será uma base sólida para qualquer tipo de blog ou CMS.
            </p>

            <h2>Tecnologias Utilizadas</h2>
            <ul>
              <li><strong>Next.js 15</strong> - Framework React para produção</li>
              <li><strong>Prisma</strong> - ORM moderno para TypeScript</li>
              <li><strong>Clerk</strong> - Autenticação completa</li>
              <li><strong>Tailwind CSS</strong> - Framework CSS utilitário</li>
              <li><strong>Shadcn/ui</strong> - Componentes UI reutilizáveis</li>
            </ul>

            <h2>Configuração Inicial</h2>
            <p>
              Primeiro, vamos criar um novo projeto Next.js e instalar todas as 
              dependências necessárias. O processo é simples e direto.
            </p>

            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code>
{`npx create-next-app@latest blog --typescript --tailwind --eslint
cd blog
npm install @prisma/client prisma @clerk/nextjs`}
              </code>
            </pre>

            <h2>Estrutura do Banco de Dados</h2>
            <p>
              Vamos criar um schema Prisma que suporte posts, categorias, tags, 
              comentários e usuários. Esta estrutura é flexível e escalável.
            </p>

            <h2>Implementação da Autenticação</h2>
            <p>
              O Clerk fornece uma solução completa de autenticação que inclui 
              login, registro, gerenciamento de perfil e muito mais.
            </p>

            <h2>Conclusão</h2>
            <p>
              Com essas tecnologias, você terá um blog moderno, seguro e escalável. 
              O Next.js oferece excelente performance, o Prisma facilita o trabalho 
              com banco de dados e o Clerk cuida de toda a autenticação.
            </p>
          </div>
        </article>

        {/* Comments Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Comentários (3)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Comment */}
            <div className="flex gap-4">
              <Avatar>
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">João Silva</span>
                  <span className="text-sm text-muted-foreground">há 2 horas</span>
                </div>
                <p className="text-sm">
                  Excelente tutorial! Muito bem explicado e fácil de seguir. 
                  Já estou implementando no meu projeto.
                </p>
              </div>
            </div>

            <Separator />

            {/* Add Comment */}
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-4">
                Faça login para comentar
              </p>
              <Link href="/sign-in">
                <Button>Entrar</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 Blog. Construído com Next.js, Prisma e Clerk.</p>
        </div>
      </footer>
    </div>
  )
}
