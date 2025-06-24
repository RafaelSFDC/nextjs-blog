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
import Link from 'next/link'
import { useUser, useClerk } from '@clerk/nextjs'
import { User, Settings, LogOut, PenTool } from 'lucide-react'

export function Header() {
  const { user, isSignedIn } = useUser()
  const { signOut } = useClerk()

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold">Blog</h1>
        </Link>
        
        <nav className="flex items-center space-x-4">
          <Link href="/blog">
            <Button variant="ghost">Posts</Button>
          </Link>
          
          {isSignedIn && (
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
          )}
          
          <ModeToggle />
          
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
        </nav>
      </div>
    </header>
  )
}
