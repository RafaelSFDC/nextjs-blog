'use server'

import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  subject: z.string().optional(),
  message: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres'),
  type: z.string().optional(),
})

export async function sendContactEmail(formData: FormData) {
  try {
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
      type: formData.get('type') as string,
    }

    // Validate data
    const validatedData = contactSchema.parse(data)

    // For now, we'll just log the contact form submission
    // In a real application, you would integrate with an email service like:
    // - Resend
    // - SendGrid
    // - Nodemailer
    // - Or save to database for admin review

    console.log('Contact form submission:', {
      ...validatedData,
      timestamp: new Date().toISOString(),
    })

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Here you would typically:
    // 1. Send email to admin
    // 2. Send confirmation email to user
    // 3. Save to database
    // 4. Integrate with CRM

    return { success: true, message: 'Mensagem enviada com sucesso!' }
  } catch (error) {
    console.error('Error sending contact email:', error)
    
    if (error instanceof z.ZodError) {
      throw new Error(error.errors[0].message)
    }
    
    throw new Error('Erro ao enviar mensagem. Tente novamente.')
  }
}

// Example integration with Resend (commented out)
/*
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendContactEmail(formData: FormData) {
  try {
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
      type: formData.get('type') as string,
    }

    const validatedData = contactSchema.parse(data)

    // Send email to admin
    await resend.emails.send({
      from: 'contato@meublog.com',
      to: 'admin@meublog.com',
      subject: `Novo contato: ${validatedData.subject || 'Sem assunto'}`,
      html: `
        <h2>Nova mensagem de contato</h2>
        <p><strong>Nome:</strong> ${validatedData.name}</p>
        <p><strong>Email:</strong> ${validatedData.email}</p>
        <p><strong>Tipo:</strong> ${validatedData.type || 'Não especificado'}</p>
        <p><strong>Assunto:</strong> ${validatedData.subject || 'Sem assunto'}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${validatedData.message.replace(/\n/g, '<br>')}</p>
      `,
    })

    // Send confirmation email to user
    await resend.emails.send({
      from: 'contato@meublog.com',
      to: validatedData.email,
      subject: 'Mensagem recebida - Meu Blog',
      html: `
        <h2>Obrigado pelo contato!</h2>
        <p>Olá ${validatedData.name},</p>
        <p>Recebi sua mensagem e entrarei em contato em breve.</p>
        <p>Sua mensagem:</p>
        <blockquote>${validatedData.message}</blockquote>
        <p>Atenciosamente,<br>Seu Nome</p>
      `,
    })

    return { success: true, message: 'Mensagem enviada com sucesso!' }
  } catch (error) {
    console.error('Error sending contact email:', error)
    
    if (error instanceof z.ZodError) {
      throw new Error(error.errors[0].message)
    }
    
    throw new Error('Erro ao enviar mensagem. Tente novamente.')
  }
}
*/
