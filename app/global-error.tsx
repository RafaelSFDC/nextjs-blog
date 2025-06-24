'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RefreshCw, AlertTriangle, Home } from 'lucide-react'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global application error:', error)
  }, [error])

  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
          <div className="max-w-2xl mx-auto text-center">
            {/* Error Icon */}
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <AlertTriangle className="h-16 w-16 text-red-600 dark:text-red-400" />
              </div>
            </div>

            {/* Error Content */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-3xl mb-2 text-red-600 dark:text-red-400">
                  Erro Crítico
                </CardTitle>
                <CardDescription className="text-lg">
                  Ocorreu um erro crítico na aplicação. Por favor, recarregue a página.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Error Details (only in development) */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="text-left bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-sm">Detalhes do erro (desenvolvimento):</h4>
                    <code className="text-xs text-slate-600 dark:text-slate-400 break-all">
                      {error.message}
                    </code>
                    {error.digest && (
                      <p className="text-xs text-slate-500 mt-2">
                        ID do erro: {error.digest}
                      </p>
                    )}
                  </div>
                )}

                <p className="text-slate-600 dark:text-slate-400">
                  Este é um erro crítico que afetou toda a aplicação. 
                  Recarregar a página geralmente resolve o problema.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                  <Button 
                    onClick={reset}
                    className="gap-2 w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Recarregar Aplicação
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.href = '/'}
                    className="gap-2 w-full sm:w-auto"
                  >
                    <Home className="h-4 w-4" />
                    Ir para o Início
                  </Button>
                </div>

                {/* Manual Reload */}
                <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    Se o problema persistir, tente recarregar manualmente:
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => window.location.reload()}
                    className="text-xs"
                  >
                    Ctrl + F5 (Windows) ou Cmd + R (Mac)
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Footer Info */}
            <div className="mt-8 text-sm text-slate-500 dark:text-slate-400">
              <p>
                Erro reportado automaticamente • {new Date().toLocaleString('pt-BR')}
              </p>
              <p className="mt-2">
                Se você continuar vendo esta mensagem, entre em contato com o suporte.
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
