"use client"

import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ModeToggle } from '@/components/mode-toggle'
import { MobileMenu } from '@/components/mobile-menu'
import Link from 'next/link'
import { useUser, useClerk } from '@clerk/nextjs'
import { User, Settings, LogOut, PenTool, Github, Linkedin, Mail, Code2 } from 'lucide-react'

export function Header() {
  const { user, isSignedIn } = useUser()
  const { signOut } = useClerk()

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo/Brand */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <Code2 className="h-5 w-5 text-primary-foreground" />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Meu Blog
            </h1>
            <span className="text-xs text-muted-foreground hidden sm:block">
              Desenvolvedor & Escritor
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link href="/">
            <Button variant="ghost" className="hover:bg-accent/50">Início</Button>
          </Link>
          <Link href="/blog">
            <Button variant="ghost" className="hover:bg-accent/50">Posts</Button>
          </Link>
          <Link href="/about">
            <Button variant="ghost" className="hover:bg-accent/50">Sobre</Button>
          </Link>
          <Link href="/contact">
            <Button variant="ghost" className="hover:bg-accent/50">Contato</Button>
          </Link>
        </nav>

        {/* Right side actions */}
        <div className="flex items-center space-x-2">
          {/* Social Links */}
          <div className="hidden sm:flex items-center space-x-1">
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
              <a href="mailto:contato@exemplo.com">
                <Mail className="h-4 w-4" />
                <span className="sr-only">Email</span>
              </a>
            </Button>
          </div>

          {isSignedIn && (
            <Link href="/dashboard">
              <Button variant="ghost" className="hidden sm:flex">Dashboard</Button>
            </Link>
          )}

          <ModeToggle />
          <MobileMenu />

          {isSignedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.imageUrl} alt={user?.firstName || ''} />
                    <AvatarFallback>
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.emailAddresses[0]?.emailAddress}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer">
                    <PenTool className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/posts/new" className="cursor-pointer">
                    <PenTool className="mr-2 h-4 w-4" />
                    <span>Escrever Post</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => signOut()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/sign-in">
                <Button variant="ghost">Entrar</Button>
              </Link>
              <Link href="/sign-up">
                <Button>Cadastrar</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
