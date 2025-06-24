import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { ArrowLeft, Mail, Phone, MapPin, Clock, Send, MessageCircle, Github, Linkedin, Twitter } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ContactForm } from './contact-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contato - Meu Blog',
  description: 'Entre em contato comigo para discutir projetos, oportunidades ou apenas bater um papo sobre tecnologia.',
  keywords: ['contato', 'email', 'projetos', 'oportunidades', 'tecnologia'],
  openGraph: {
    title: 'Contato - Meu Blog',
    description: 'Entre em contato comigo para discutir projetos, oportunidades ou apenas bater um papo sobre tecnologia.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contato - Meu Blog',
    description: 'Entre em contato comigo para discutir projetos, oportunidades ou apenas bater um papo sobre tecnologia.',
  },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2 mb-6">
                <ArrowLeft className="h-4 w-4" />
                Voltar ao Início
              </Button>
            </Link>
            
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">Vamos Conversar?</h1>
                </div>
              </div>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Estou sempre aberto para discutir novos projetos, oportunidades criativas
                ou apenas bater um papo sobre tecnologia.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Envie uma Mensagem
                  </CardTitle>
                  <CardDescription>
                    Preencha o formulário abaixo e entrarei em contato o mais breve possível.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ContactForm />
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              {/* Contact Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Informações de Contato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <a href="mailto:contato@meublog.com" className="text-muted-foreground hover:text-primary transition-colors">
                        contato@meublog.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Localização</p>
                      <p className="text-muted-foreground">São Paulo, Brasil</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Horário de Resposta</p>
                      <p className="text-muted-foreground">24-48 horas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card>
                <CardHeader>
                  <CardTitle>Redes Sociais</CardTitle>
                  <CardDescription>
                    Me siga nas redes sociais para acompanhar meu trabalho
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <a 
                    href="https://github.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <Github className="h-5 w-5" />
                    <div>
                      <p className="font-medium">GitHub</p>
                      <p className="text-sm text-muted-foreground">Veja meus projetos</p>
                    </div>
                  </a>

                  <a 
                    href="https://linkedin.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <Linkedin className="h-5 w-5" />
                    <div>
                      <p className="font-medium">LinkedIn</p>
                      <p className="text-sm text-muted-foreground">Conecte-se comigo</p>
                    </div>
                  </a>

                  <a 
                    href="https://twitter.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <Twitter className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Twitter</p>
                      <p className="text-sm text-muted-foreground">Acompanhe minhas atualizações</p>
                    </div>
                  </a>
                </CardContent>
              </Card>

              {/* FAQ */}
              <Card>
                <CardHeader>
                  <CardTitle>Perguntas Frequentes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-1">Quanto tempo para responder?</h4>
                    <p className="text-sm text-muted-foreground">
                      Geralmente respondo em 24-48 horas durante dias úteis.
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium mb-1">Aceita projetos freelance?</h4>
                    <p className="text-sm text-muted-foreground">
                      Sim! Estou sempre aberto a discutir novos projetos interessantes.
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium mb-1">Oferece consultoria?</h4>
                    <p className="text-sm text-muted-foreground">
                      Sim, ofereço consultoria em desenvolvimento web e arquitetura de software.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
