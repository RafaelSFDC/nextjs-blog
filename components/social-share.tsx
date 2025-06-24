'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Share2, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Link as LinkIcon, 
  MessageCircle,
  Mail,
  Copy,
  Check
} from 'lucide-react'
import { toast } from 'sonner'

interface SocialShareProps {
  url: string
  title: string
  description?: string
  hashtags?: string[]
  via?: string
  size?: 'sm' | 'default' | 'lg'
  variant?: 'default' | 'outline' | 'ghost'
  showLabel?: boolean
}

export function SocialShare({
  url,
  title,
  description = '',
  hashtags = [],
  via = '',
  size = 'default',
  variant = 'outline',
  showLabel = true
}: SocialShareProps) {
  const [copied, setCopied] = useState(false)

  const fullUrl = typeof window !== 'undefined' 
    ? new URL(url, window.location.origin).toString()
    : url

  const encodedUrl = encodeURIComponent(fullUrl)
  const encodedTitle = encodeURIComponent(title)
  const encodedDescription = encodeURIComponent(description)
  const encodedHashtags = hashtags.join(',')

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}${via ? `&via=${via}` : ''}${hashtags.length ? `&hashtags=${encodedHashtags}` : ''}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      toast.success('Link copiado para a área de transferência!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
      toast.error('Erro ao copiar link')
    }
  }

  const openShareWindow = (url: string) => {
    window.open(
      url,
      'share',
      'width=600,height=400,scrollbars=yes,resizable=yes'
    )
  }

  const shareItems = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: shareLinks.twitter,
      color: 'hover:text-blue-500'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: shareLinks.facebook,
      color: 'hover:text-blue-600'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: shareLinks.linkedin,
      color: 'hover:text-blue-700'
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: shareLinks.whatsapp,
      color: 'hover:text-green-600'
    },
    {
      name: 'Email',
      icon: Mail,
      url: shareLinks.email,
      color: 'hover:text-gray-600'
    }
  ]

  // Check if Web Share API is available
  const canUseWebShare = typeof navigator !== 'undefined' && 'share' in navigator

  const handleWebShare = async () => {
    if (canUseWebShare) {
      try {
        await navigator.share({
          title,
          text: description,
          url: fullUrl,
        })
      } catch (error) {
        // User cancelled or error occurred
        console.log('Web share cancelled or failed:', error)
      }
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className="gap-2">
          <Share2 className="h-4 w-4" />
          {showLabel && 'Compartilhar'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {/* Web Share API (mobile) */}
        {canUseWebShare && (
          <DropdownMenuItem onClick={handleWebShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Compartilhar
          </DropdownMenuItem>
        )}
        
        {/* Social platforms */}
        {shareItems.map((item) => (
          <DropdownMenuItem
            key={item.name}
            onClick={() => {
              if (item.name === 'Email') {
                window.location.href = item.url
              } else {
                openShareWindow(item.url)
              }
            }}
            className={item.color}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.name}
          </DropdownMenuItem>
        ))}
        
        {/* Copy link */}
        <DropdownMenuItem onClick={copyToClipboard}>
          {copied ? (
            <Check className="mr-2 h-4 w-4 text-green-600" />
          ) : (
            <Copy className="mr-2 h-4 w-4" />
          )}
          {copied ? 'Copiado!' : 'Copiar link'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Simplified version for inline sharing buttons
export function SocialShareButtons({
  url,
  title,
  description = '',
  hashtags = [],
  via = '',
  className = ''
}: SocialShareProps & { className?: string }) {
  const fullUrl = typeof window !== 'undefined' 
    ? new URL(url, window.location.origin).toString()
    : url

  const encodedUrl = encodeURIComponent(fullUrl)
  const encodedTitle = encodeURIComponent(title)
  const encodedHashtags = hashtags.join(',')

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}${via ? `&via=${via}` : ''}${hashtags.length ? `&hashtags=${encodedHashtags}` : ''}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  }

  const openShareWindow = (url: string) => {
    window.open(
      url,
      'share',
      'width=600,height=400,scrollbars=yes,resizable=yes'
    )
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => openShareWindow(shareLinks.twitter)}
        className="gap-2 hover:text-blue-500"
      >
        <Twitter className="h-4 w-4" />
        Twitter
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => openShareWindow(shareLinks.facebook)}
        className="gap-2 hover:text-blue-600"
      >
        <Facebook className="h-4 w-4" />
        Facebook
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => openShareWindow(shareLinks.linkedin)}
        className="gap-2 hover:text-blue-700"
      >
        <Linkedin className="h-4 w-4" />
        LinkedIn
      </Button>
    </div>
  )
}
