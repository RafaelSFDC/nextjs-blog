import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { CalendarDays, ArrowRight, MessageCircle, Code2, Laptop, Coffee, BookOpen, Github, Linkedin, Mail, Download, ExternalLink, Heart, Star, Users, TrendingUp } from 'lucide-react'
import { PostWithDetails } from '@/types/blog'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { searchPosts } from '@/app/actions/posts'
import { PostStatus } from '@prisma/client'

export const dynamic = 'force-dynamic'

export default async function Home() {
  // Buscar posts em destaque e recentes em paralelo
  const [featuredResult, recentResult] = await Promise.all([
    searchPosts({
      featured: true,
      limit: 3,
      status: PostStatus.PUBLISHED,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    }),
    searchPosts({
      limit: 6,
      status: PostStatus.PUBLISHED,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    })
  ])

  const featuredPosts = featuredResult.data
  const recentPosts = recentResult.data
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Header />

      {/* Hero Section */}
      <section className="py-20 lg:py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <Code2 className="h-4 w-4" />
                  Desenvolvedor Full Stack
                </div>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Olá, eu sou{' '}
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Seu Nome
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Desenvolvedor apaixonado por tecnologia, compartilhando conhecimento sobre
                  desenvolvimento web, carreira em tech e experiências pessoais.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href="/blog">
                  <Button size="lg" className="gap-2">
                    <BookOpen className="h-4 w-4" />
                    Ler Posts
                  </Button>
                </Link>
                <Link href="/#contato">
                  <Button variant="outline" size="lg" className="gap-2">
                    <Mail className="h-4 w-4" />
                    Entrar em Contato
                  </Button>
                </Link>
                <Button variant="ghost" size="lg" className="gap-2" asChild>
                  <a href="/cv.pdf" target="_blank">
                    <Download className="h-4 w-4" />
                    Download CV
                  </a>
                </Button>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Conecte-se:</span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                      <Github className="h-5 w-5" />
                    </a>
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-5 w-5" />
                    </a>
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <a href="mailto:contato@exemplo.com">
                      <Mail className="h-5 w-5" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Content - Avatar/Image */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-80 h-80 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <Avatar className="w-64 h-64">
                    <AvatarImage src="/avatar.jpg" alt="Seu Nome" />
                    <AvatarFallback className="text-4xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground">
                      SN
                    </AvatarFallback>
                  </Avatar>
                </div>
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 bg-background border rounded-lg p-3 shadow-lg">
                  <Code2 className="h-6 w-6 text-primary" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-background border rounded-lg p-3 shadow-lg">
                  <Coffee className="h-6 w-6 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-background/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">50+</div>
              <div className="text-sm text-muted-foreground">Posts Publicados</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">10k+</div>
              <div className="text-sm text-muted-foreground">Visualizações</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Leitores</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">3+</div>
              <div className="text-sm text-muted-foreground">Anos Escrevendo</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-3xl lg:text-4xl font-bold">Sobre Mim</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Sou um desenvolvedor full stack com mais de 5 anos de experiência,
                  especializado em React, Node.js e tecnologias modernas. Adoro compartilhar
                  conhecimento e ajudar outros desenvolvedores em sua jornada.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Quando não estou codando, você pode me encontrar escrevendo sobre tecnologia,
                  tomando café ou explorando novas ferramentas e frameworks.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Tecnologias que uso:</h3>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Next.js', 'TypeScript', 'Node.js', 'Prisma', 'PostgreSQL', 'Tailwind CSS', 'Docker'].map((tech) => (
                    <Badge key={tech} variant="secondary" className="px-3 py-1">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Laptop className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Desenvolvimento</h3>
                    <p className="text-sm text-muted-foreground">Full Stack Developer</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  Criando aplicações web modernas e escaláveis com as melhores práticas.
                </p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Escrita</h3>
                    <p className="text-sm text-muted-foreground">Tech Writer</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  Compartilhando conhecimento através de artigos técnicos e tutoriais.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts Preview */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Posts em Destaque</h2>
          {featuredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Nenhum post em destaque encontrado</p>
              <Link href="/blog">
                <Button variant="outline">Ver Todos os Posts</Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    {post.coverImage && (
                      <div className="aspect-video overflow-hidden rounded-t-lg">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {post.category && (
                          <Badge
                            variant="secondary"
                            style={{ backgroundColor: (post.category.color || '#6366f1') + '20', color: post.category.color || '#6366f1' }}
                          >
                            {post.category.name}
                          </Badge>
                        )}
                        <Badge variant="default">Destaque</Badge>
                      </div>
                      <CardTitle className="line-clamp-2">
                        {post.title}
                      </CardTitle>
                      {post.excerpt && (
                        <CardDescription className="line-clamp-3">
                          {post.excerpt}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={post.author.imageUrl || undefined} />
                            <AvatarFallback className="text-xs">
                              {post.author.firstName?.[0]}{post.author.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">
                            {post.author.firstName} {post.author.lastName}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <CalendarDays className="h-4 w-4" />
                            <span>{format(new Date(post.createdAt), 'dd MMM', { locale: ptBR })}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{post._count.comments}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Link href="/blog">
              <Button variant="outline" size="lg">
                Ver Todos os Posts
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="py-16 px-4 bg-background/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Posts Recentes</h2>
          {recentPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum post encontrado</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPosts.slice(0, 6).map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    {post.coverImage && (
                      <div className="aspect-video overflow-hidden rounded-t-lg">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {post.category && (
                          <Badge
                            variant="secondary"
                            style={{ backgroundColor: (post.category.color || '#6366f1') + '20', color: post.category.color || '#6366f1' }}
                          >
                            {post.category.name}
                          </Badge>
                        )}
                        {post.featured && <Badge variant="default">Destaque</Badge>}
                      </div>
                      <CardTitle className="line-clamp-2">
                        {post.title}
                      </CardTitle>
                      {post.excerpt && (
                        <CardDescription className="line-clamp-3">
                          {post.excerpt}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={post.author.imageUrl || undefined} />
                            <AvatarFallback className="text-xs">
                              {post.author.firstName?.[0]}{post.author.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">
                            {post.author.firstName} {post.author.lastName}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <CalendarDays className="h-4 w-4" />
                            <span>{format(new Date(post.createdAt), 'dd MMM', { locale: ptBR })}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{post._count.comments}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="py-20 px-4 bg-background/50">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold">Vamos Conversar?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Estou sempre aberto para discutir novos projetos, oportunidades criativas
                ou apenas bater um papo sobre tecnologia.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-muted-foreground mb-4">Envie-me um email</p>
                <Button variant="outline" asChild>
                  <a href="mailto:contato@exemplo.com">
                    Enviar Email
                  </a>
                </Button>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Linkedin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">LinkedIn</h3>
                <p className="text-muted-foreground mb-4">Conecte-se comigo</p>
                <Button variant="outline" asChild>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                    Conectar
                  </a>
                </Button>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Github className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">GitHub</h3>
                <p className="text-muted-foreground mb-4">Veja meus projetos</p>
                <Button variant="outline" asChild>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                    Ver Projetos
                  </a>
                </Button>
              </Card>
            </div>

            <div className="pt-8">
              <p className="text-muted-foreground mb-4">
                Ou me encontre nas redes sociais
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                    <Github className="h-5 w-5" />
                  </a>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-5 w-5" />
                  </a>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <a href="mailto:contato@exemplo.com">
                    <Mail className="h-5 w-5" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
