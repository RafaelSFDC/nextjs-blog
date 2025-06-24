import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { ArrowLeft, FileText, Scale, AlertTriangle, Mail } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Termos de Uso | Meu Blog',
  description: 'Termos de uso e condições de utilização do Meu Blog. Leia os termos que regem o uso de nossos serviços.',
  openGraph: {
    title: 'Termos de Uso',
    description: 'Termos de uso e condições de utilização do Meu Blog.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Termos de Uso',
    description: 'Termos de uso e condições de utilização do Meu Blog.',
  },
}

export default function TermsPage() {
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
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Termos de Uso</h1>
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
                  <Scale className="h-5 w-5" />
                  Introdução
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Bem-vindo ao <strong>Meu Blog</strong>. Estes Termos de Uso regem o uso de nosso site e serviços. 
                  Ao acessar ou usar nosso site, você concorda em cumprir estes termos.
                </p>
                <p>
                  Se você não concordar com qualquer parte destes termos, não deve usar nosso site. 
                  Reservamo-nos o direito de modificar estes termos a qualquer momento.
                </p>
              </CardContent>
            </Card>

            {/* Acceptance */}
            <Card>
              <CardHeader>
                <CardTitle>Aceitação dos Termos</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Ao acessar e usar este site, você aceita e concorda em ficar vinculado aos termos e 
                  condições deste acordo. Se você não concordar com qualquer um destes termos e condições, 
                  não deve usar este site.
                </p>
              </CardContent>
            </Card>

            {/* Use License */}
            <Card>
              <CardHeader>
                <CardTitle>Licença de Uso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  É concedida permissão para baixar temporariamente uma cópia dos materiais no site do 
                  Meu Blog apenas para visualização transitória pessoal e não comercial.
                </p>
                <div>
                  <h4 className="font-semibold mb-2">Esta licença NÃO permite que você:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Modifique ou copie os materiais</li>
                    <li>Use os materiais para qualquer finalidade comercial</li>
                    <li>Tente fazer engenharia reversa de qualquer software</li>
                    <li>Remova quaisquer direitos autorais ou outras notações proprietárias</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* User Accounts */}
            <Card>
              <CardHeader>
                <CardTitle>Contas de Usuário</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Para acessar certas funcionalidades do site, você pode precisar criar uma conta. 
                  Você é responsável por:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Manter a confidencialidade de sua senha</li>
                  <li>Todas as atividades que ocorrem em sua conta</li>
                  <li>Notificar-nos imediatamente sobre qualquer uso não autorizado</li>
                  <li>Fornecer informações precisas e atualizadas</li>
                </ul>
              </CardContent>
            </Card>

            {/* User Content */}
            <Card>
              <CardHeader>
                <CardTitle>Conteúdo do Usuário</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Nosso serviço pode permitir que você publique, vincule, armazene, compartilhe e 
                  disponibilize certas informações, textos, gráficos, vídeos ou outros materiais.
                </p>
                <div>
                  <h4 className="font-semibold mb-2">Você é responsável pelo conteúdo que publica e concorda em não publicar conteúdo que:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Seja ilegal, prejudicial, ameaçador, abusivo ou assediador</li>
                    <li>Viole direitos autorais ou outros direitos de propriedade intelectual</li>
                    <li>Contenha vírus ou outros códigos maliciosos</li>
                    <li>Seja spam ou conteúdo promocional não solicitado</li>
                    <li>Viole a privacidade de outros</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Prohibited Uses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Usos Proibidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Você não pode usar nosso site para:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0" />
                    <span>Qualquer finalidade ilegal ou para solicitar outros a realizar atos ilegais</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0" />
                    <span>Violar regulamentações, regras, leis ou ordenanças locais</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0" />
                    <span>Infringir ou violar nossos direitos de propriedade intelectual</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0" />
                    <span>Assediar, abusar, insultar, prejudicar ou difamar outros usuários</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0" />
                    <span>Transmitir vírus ou qualquer outro tipo de código malicioso</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Intellectual Property */}
            <Card>
              <CardHeader>
                <CardTitle>Propriedade Intelectual</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  O site e seu conteúdo original, recursos e funcionalidades são e permanecerão 
                  propriedade exclusiva do Meu Blog e seus licenciadores. O site é protegido por 
                  direitos autorais, marcas registradas e outras leis.
                </p>
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <Card>
              <CardHeader>
                <CardTitle>Isenção de Responsabilidade</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  As informações neste site são fornecidas "como estão". O Meu Blog não oferece 
                  garantias, expressas ou implícitas, e por este meio isenta e nega todas as outras 
                  garantias.
                </p>
                <p>
                  Além disso, o Meu Blog não garante ou faz qualquer representação sobre a precisão, 
                  resultados prováveis ou confiabilidade do uso dos materiais em seu site.
                </p>
              </CardContent>
            </Card>

            {/* Limitations */}
            <Card>
              <CardHeader>
                <CardTitle>Limitações</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Em nenhum caso o Meu Blog ou seus fornecedores serão responsáveis por quaisquer 
                  danos (incluindo, sem limitação, danos por perda de dados ou lucro, ou devido a 
                  interrupção dos negócios) decorrentes do uso ou da incapacidade de usar os materiais 
                  no site do Meu Blog.
                </p>
              </CardContent>
            </Card>

            {/* Termination */}
            <Card>
              <CardHeader>
                <CardTitle>Rescisão</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Podemos encerrar ou suspender sua conta e barrar o acesso ao serviço imediatamente, 
                  sem aviso prévio ou responsabilidade, por qualquer motivo, incluindo, sem limitação, 
                  se você violar os Termos.
                </p>
              </CardContent>
            </Card>

            {/* Governing Law */}
            <Card>
              <CardHeader>
                <CardTitle>Lei Aplicável</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Estes termos e condições são regidos e interpretados de acordo com as leis do Brasil, 
                  e você se submete irrevogavelmente à jurisdição exclusiva dos tribunais brasileiros.
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
                  Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco:
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <p><strong>E-mail:</strong> legal@meublog.com</p>
                  <p><strong>Endereço:</strong> [Seu endereço]</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer Actions */}
          <div className="mt-12 pt-8 border-t">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/privacy">
                <Button variant="outline">Ver Política de Privacidade</Button>
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
