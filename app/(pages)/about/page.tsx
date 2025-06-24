import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowLeft, 
  Code2, 
  Coffee, 
  BookOpen, 
  Users, 
  Award, 
  Calendar,
  Github,
  Linkedin,
  Mail,
  Download,
  ExternalLink,
  Heart,
  Star,
  TrendingUp
} from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sobre Mim - Meu Blog',
  description: 'Conheça minha história, experiência e paixão por desenvolvimento web. Desenvolvedor full stack especializado em React, Node.js e tecnologias modernas.',
  keywords: ['sobre', 'desenvolvedor', 'experiência', 'biografia', 'carreira', 'tecnologia'],
  openGraph: {
    title: 'Sobre Mim - Meu Blog',
    description: 'Conheça minha história, experiência e paixão por desenvolvimento web.',
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sobre Mim - Meu Blog',
    description: 'Conheça minha história, experiência e paixão por desenvolvimento web.',
  },
}

export default function AboutPage() {
  const skills = [
    'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Python',
    'PostgreSQL', 'MongoDB', 'Docker', 'AWS', 'Git', 'Figma'
  ]

  const experiences = [
    {
      title: 'Senior Full Stack Developer',
      company: 'Tech Company',
      period: '2022 - Presente',
      description: 'Desenvolvimento de aplicações web complexas usando React, Node.js e AWS.'
    },
    {
      title: 'Full Stack Developer',
      company: 'Startup Inovadora',
      period: '2020 - 2022',
      description: 'Criação de MVPs e produtos digitais do zero usando tecnologias modernas.'
    },
    {
      title: 'Frontend Developer',
      company: 'Agência Digital',
      period: '2018 - 2020',
      description: 'Desenvolvimento de interfaces responsivas e experiências de usuário excepcionais.'
    }
  ]

  const achievements = [
    { icon: Code2, title: '50+ Projetos', description: 'Projetos entregues com sucesso' },
    { icon: Users, title: '20+ Clientes', description: 'Clientes satisfeitos' },
    { icon: BookOpen, title: '100+ Posts', description: 'Artigos técnicos publicados' },
    { icon: Star, title: '5 Anos', description: 'De experiência em desenvolvimento' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2 mb-6">
                <ArrowLeft className="h-4 w-4" />
                Voltar ao Início
              </Button>
            </Link>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="w-32 h-32 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center">
                <Code2 className="h-16 w-16 text-primary-foreground" />
              </div>
              {/* Replace with actual photo when available */}
              {/* <Image
                src="/profile-photo.jpg"
                alt="Foto de perfil"
                fill
                className="rounded-full object-cover"
              /> */}
            </div>
            <h1 className="text-4xl font-bold mb-4">Olá, eu sou [Seu Nome]</h1>
            <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
              Desenvolvedor Full Stack apaixonado por criar soluções digitais inovadoras 
              e compartilhar conhecimento através da escrita.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild>
                <Link href="/contact">
                  <Mail className="h-4 w-4 mr-2" />
                  Entre em Contato
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <a href="/cv.pdf" target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4 mr-2" />
                  Download CV
                </a>
              </Button>
            </div>
          </div>

          {/* About Content */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2 space-y-8">
              {/* Story */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Minha História
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    Minha jornada no desenvolvimento começou há mais de 5 anos, quando descobri 
                    a magia de transformar ideias em código. Desde então, tenho me dedicado a 
                    criar soluções digitais que fazem a diferença na vida das pessoas.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Especializo-me em desenvolvimento full stack, com foco em tecnologias modernas 
                    como React, Next.js, Node.js e TypeScript. Adoro trabalhar em projetos desafiadores 
                    que me permitem aprender e crescer constantemente.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Além de programar, sou apaixonado por compartilhar conhecimento. Este blog é 
                    minha forma de contribuir com a comunidade de desenvolvedores, compartilhando 
                    experiências, tutoriais e insights sobre tecnologia.
                  </p>
                </CardContent>
              </Card>

              {/* Experience */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Experiência Profissional
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {experiences.map((exp, index) => (
                      <div key={index} className="relative">
                        {index !== experiences.length - 1 && (
                          <div className="absolute left-4 top-8 w-px h-16 bg-border" />
                        )}
                        <div className="flex gap-4">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                            <div className="w-3 h-3 bg-primary-foreground rounded-full" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{exp.title}</h3>
                            <p className="text-primary font-medium">{exp.company}</p>
                            <p className="text-sm text-muted-foreground mb-2">{exp.period}</p>
                            <p className="text-sm text-muted-foreground">{exp.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Skills */}
              <Card>
                <CardHeader>
                  <CardTitle>Tecnologias</CardTitle>
                  <CardDescription>
                    Principais ferramentas que uso no dia a dia
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card>
                <CardHeader>
                  <CardTitle>Conecte-se Comigo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <a 
                    href="https://github.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <Github className="h-5 w-5" />
                    <div className="flex-1">
                      <p className="font-medium">GitHub</p>
                      <p className="text-sm text-muted-foreground">Veja meus projetos</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </a>

                  <a 
                    href="https://linkedin.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <Linkedin className="h-5 w-5" />
                    <div className="flex-1">
                      <p className="font-medium">LinkedIn</p>
                      <p className="text-sm text-muted-foreground">Conecte-se profissionalmente</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </a>

                  <Link 
                    href="/contact"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <Mail className="h-5 w-5" />
                    <div className="flex-1">
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">Entre em contato</p>
                    </div>
                  </Link>
                </CardContent>
              </Card>

              {/* Fun Facts */}
              <Card>
                <CardHeader>
                  <CardTitle>Curiosidades</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Coffee className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">Consumo 4+ cafés por dia</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Code2 className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">Programo há 5+ anos</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Heart className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">Amo ensinar e aprender</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Achievements */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-center">Conquistas</CardTitle>
              <CardDescription className="text-center">
                Alguns números que representam minha jornada
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {achievements.map((achievement, index) => (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <achievement.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <Card>
            <CardContent className="text-center py-8">
              <h2 className="text-2xl font-bold mb-4">Vamos Trabalhar Juntos?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Estou sempre aberto a novos desafios e oportunidades. 
                Se você tem um projeto interessante ou quer apenas bater um papo sobre tecnologia, 
                não hesite em entrar em contato!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg">
                  <Link href="/contact">
                    <Mail className="h-4 w-4 mr-2" />
                    Entre em Contato
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/blog">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Leia Meus Posts
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
