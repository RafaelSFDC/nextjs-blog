'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Send, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { sendContactEmail } from '@/app/actions/contact'

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
  type: string
}

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Por favor, preencha todos os campos obrigatórios')
      return
    }

    setIsSubmitting(true)

    try {
      const formDataObj = new FormData()
      formDataObj.append('name', formData.name)
      formDataObj.append('email', formData.email)
      formDataObj.append('subject', formData.subject)
      formDataObj.append('message', formData.message)
      formDataObj.append('type', formData.type)

      await sendContactEmail(formDataObj)
      
      toast.success('Mensagem enviada com sucesso! Entrarei em contato em breve.')
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        type: ''
      })
    } catch (error) {
      console.error('Error sending contact email:', error)
      toast.error('Erro ao enviar mensagem. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome *</Label>
          <Input
            id="name"
            placeholder="Seu nome completo"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Tipo de Contato</Label>
        <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo de contato" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="project">Projeto/Freelance</SelectItem>
            <SelectItem value="consultation">Consultoria</SelectItem>
            <SelectItem value="collaboration">Colaboração</SelectItem>
            <SelectItem value="question">Pergunta Técnica</SelectItem>
            <SelectItem value="feedback">Feedback do Blog</SelectItem>
            <SelectItem value="other">Outro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Assunto</Label>
        <Input
          id="subject"
          placeholder="Assunto da sua mensagem"
          value={formData.subject}
          onChange={(e) => handleChange('subject', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Mensagem *</Label>
        <Textarea
          id="message"
          placeholder="Descreva sua mensagem, projeto ou pergunta..."
          rows={6}
          value={formData.message}
          onChange={(e) => handleChange('message', e.target.value)}
          required
        />
      </div>

      <Button 
        type="submit" 
        className="w-full gap-2" 
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Enviar Mensagem
          </>
        )}
      </Button>

      <p className="text-sm text-muted-foreground text-center">
        * Campos obrigatórios. Seus dados serão tratados com total privacidade.
      </p>
    </form>
  )
}
