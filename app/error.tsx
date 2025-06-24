'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Home, RefreshCw, AlertTriangle, ArrowLeft } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Error Icon */}
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-16 w-16 text-destructive" />
            </div>
          </div>

          {/* Error Content */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-3xl mb-2 text-destructive">
                Algo deu errado!
              </CardTitle>
              <CardDescription className="text-lg">
                Ocorreu um erro inesperado. Nosso time foi notificado e está trabalhando para resolver.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Error Details (only in development) */}
              {process.env.NODE_ENV === 'development' && (
                <div className="text-left bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-sm">Detalhes do erro (desenvolvimento):</h4>
                  <code className="text-xs text-muted-foreground break-all">
                    {error.message}
                  </code>
                  {error.digest && (
                    <p className="text-xs text-muted-foreground mt-2">
                      ID do erro: {error.digest}
                    </p>
                  )}
                </div>
              )}

              <p className="text-muted-foreground">
                Você pode tentar as seguintes opções:
              </p>
              
              <ul className="text-left text-muted-foreground space-y-2 max-w-md mx-auto">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>Recarregar a página</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>Voltar à página anterior</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>Ir para a página inicial</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>Tentar novamente em alguns minutos</span>
                </li>
              </ul>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button 
                  onClick={reset}
                  className="gap-2 w-full sm:w-auto"
                >
                  <RefreshCw className="h-4 w-4" />
                  Tentar Novamente
                </Button>
                
                <Link href="/">
                  <Button variant="outline" className="gap-2 w-full sm:w-auto">
                    <Home className="h-4 w-4" />
                    Ir para o Início
                  </Button>
                </Link>
                
                <Button 
                  variant="ghost" 
                  onClick={() => window.history.back()}
                  className="gap-2 w-full sm:w-auto"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </Button>
              </div>

              {/* Contact Support */}
              <div className="pt-6 border-t">
                <p className="text-sm text-muted-foreground mb-4">
                  Se o problema persistir, entre em contato conosco:
                </p>
                <Link href="/#contato">
                  <Button variant="outline" size="sm">
                    Entrar em Contato
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="mt-8 text-sm text-muted-foreground">
            <p>
              Erro reportado automaticamente • {new Date().toLocaleString('pt-BR')}
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
