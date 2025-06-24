import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { ArrowLeft, Shield, Eye, Cookie, Mail } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidade | Meu Blog',
  description: 'Política de privacidade e proteção de dados do Meu Blog. Saiba como coletamos, usamos e protegemos suas informações.',
  openGraph: {
    title: 'Política de Privacidade',
    description: 'Política de privacidade e proteção de dados do Meu Blog.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Política de Privacidade',
    description: 'Política de privacidade e proteção de dados do Meu Blog.',
  },
}

export default function PrivacyPage() {
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
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Política de Privacidade</h1>
                <p className="text-muted-foreground">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {/* Introduction */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Introdução
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Esta Política de Privacidade descreve como o <strong>Meu Blog</strong> coleta, usa e protege 
                  suas informações pessoais quando você visita nosso site ou utiliza nossos serviços.
                </p>
                <p>
                  Respeitamos sua privacidade e estamos comprometidos em proteger suas informações pessoais. 
                  Esta política explica quais informações coletamos, como as usamos e quais direitos você tem 
                  em relação aos seus dados.
                </p>
              </CardContent>
            </Card>

            {/* Information We Collect */}
            <Card>
              <CardHeader>
                <CardTitle>Informações que Coletamos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Informações fornecidas por você:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Nome e endereço de e-mail ao criar uma conta</li>
                    <li>Comentários e conteúdo que você publica</li>
                    <li>Informações de contato quando você nos envia mensagens</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Informações coletadas automaticamente:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Endereço IP e informações do dispositivo</li>
                    <li>Dados de navegação e páginas visitadas</li>
                    <li>Cookies e tecnologias similares</li>
                    <li>Informações de localização aproximada</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Information */}
            <Card>
              <CardHeader>
                <CardTitle>Como Usamos suas Informações</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span>Fornecer e melhorar nossos serviços</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span>Personalizar sua experiência no site</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span>Comunicar com você sobre atualizações e novidades</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span>Analisar o uso do site para melhorias</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span>Proteger contra fraudes e atividades maliciosas</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Cookies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cookie className="h-5 w-5" />
                  Cookies e Tecnologias Similares
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Utilizamos cookies e tecnologias similares para melhorar sua experiência em nosso site. 
                  Os cookies nos ajudam a:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Lembrar suas preferências e configurações</li>
                  <li>Manter você logado em sua conta</li>
                  <li>Analisar como você usa nosso site</li>
                  <li>Personalizar conteúdo e anúncios</li>
                </ul>
                <p className="text-sm text-muted-foreground">
                  Você pode controlar o uso de cookies através das configurações do seu navegador.
                </p>
              </CardContent>
            </Card>

            {/* Data Sharing */}
            <Card>
              <CardHeader>
                <CardTitle>Compartilhamento de Dados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, 
                  exceto nas seguintes situações:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Com seu consentimento explícito</li>
                  <li>Para cumprir obrigações legais</li>
                  <li>Para proteger nossos direitos e segurança</li>
                  <li>Com provedores de serviços que nos ajudam a operar o site</li>
                </ul>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card>
              <CardHeader>
                <CardTitle>Seus Direitos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Você tem os seguintes direitos em relação aos seus dados pessoais:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span><strong>Acesso:</strong> Solicitar uma cópia dos dados que temos sobre você</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span><strong>Correção:</strong> Solicitar a correção de dados incorretos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span><strong>Exclusão:</strong> Solicitar a exclusão de seus dados</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span><strong>Portabilidade:</strong> Solicitar seus dados em formato legível</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span><strong>Objeção:</strong> Opor-se ao processamento de seus dados</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Security */}
            <Card>
              <CardHeader>
                <CardTitle>Segurança</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Implementamos medidas de segurança técnicas e organizacionais apropriadas para proteger 
                  suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição. 
                  Isso inclui criptografia, controles de acesso e monitoramento regular de nossos sistemas.
                </p>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contato
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Se você tiver dúvidas sobre esta Política de Privacidade ou quiser exercer seus direitos, 
                  entre em contato conosco:
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <p><strong>E-mail:</strong> privacidade@meublog.com</p>
                  <p><strong>Endereço:</strong> [Seu endereço]</p>
                </div>
              </CardContent>
            </Card>

            {/* Updates */}
            <Card>
              <CardHeader>
                <CardTitle>Atualizações desta Política</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Podemos atualizar esta Política de Privacidade periodicamente. Quando fizermos alterações 
                  significativas, notificaremos você por e-mail ou através de um aviso em nosso site. 
                  A data da última atualização será sempre indicada no topo desta página.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Footer Actions */}
          <div className="mt-12 pt-8 border-t">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/terms">
                <Button variant="outline">Ver Termos de Uso</Button>
              </Link>
              <Link href="/#contato">
                <Button>Entrar em Contato</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
