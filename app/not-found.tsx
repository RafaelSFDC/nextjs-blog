import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Home, ArrowLeft, Search, FileQuestion } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Error Icon */}
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <FileQuestion className="h-16 w-16 text-muted-foreground" />
            </div>
          </div>

          {/* Error Content */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="text-6xl font-bold text-primary mb-4">404</div>
              <CardTitle className="text-3xl mb-2">Página não encontrada</CardTitle>
              <CardDescription className="text-lg">
                Ops! A página que você está procurando não existe ou foi movida.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Isso pode ter acontecido porque:
              </p>
              
              <ul className="text-left text-muted-foreground space-y-2 max-w-md mx-auto">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>O link que você clicou está quebrado</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>A página foi removida ou renomeada</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>Você digitou o endereço incorretamente</span>
                </li>
              </ul>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Link href="/">
                  <Button className="gap-2 w-full sm:w-auto">
                    <Home className="h-4 w-4" />
                    Ir para o Início
                  </Button>
                </Link>
                
                <Link href="/blog">
                  <Button variant="outline" className="gap-2 w-full sm:w-auto">
                    <Search className="h-4 w-4" />
                    Ver Posts
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

              {/* Search Suggestion */}
              <div className="pt-6 border-t">
                <p className="text-sm text-muted-foreground mb-4">
                  Ou tente buscar pelo que você estava procurando:
                </p>
                <Link href="/blog">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Search className="h-4 w-4" />
                    Buscar no Blog
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Additional Help */}
          <div className="mt-8 text-sm text-muted-foreground">
            <p>
              Se você acredita que isso é um erro, entre em contato conosco através da{' '}
              <Link href="/#contato" className="text-primary hover:underline">
                página de contato
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
