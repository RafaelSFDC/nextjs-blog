import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

/**
 * Sincroniza o usuário atual do Clerk com o banco de dados
 * Esta função deve ser chamada em server actions ou server components
 * quando precisamos garantir que o usuário existe no banco
 */
export async function syncCurrentUser() {
  try {
    const clerkUser = await currentUser()
    
    if (!clerkUser) {
      return null
    }

    // Verificar se o usuário já existe no banco
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id }
    })

    if (existingUser) {
      // Atualizar dados do usuário se necessário
      const updatedUser = await prisma.user.update({
        where: { clerkId: clerkUser.id },
        data: {
          email: clerkUser.emailAddresses[0]?.emailAddress || existingUser.email,
          firstName: clerkUser.firstName || existingUser.firstName,
          lastName: clerkUser.lastName || existingUser.lastName,
          imageUrl: clerkUser.imageUrl || existingUser.imageUrl,
        }
      })
      return updatedUser
    } else {
      // Criar novo usuário no banco
      const newUser = await prisma.user.create({
        data: {
          clerkId: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          imageUrl: clerkUser.imageUrl,
        }
      })
      return newUser
    }
  } catch (error) {
    console.error('Error syncing user:', error)
    return null
  }
}

/**
 * Obtém o usuário atual do banco de dados, sincronizando se necessário
 */
export async function getCurrentUser() {
  return await syncCurrentUser()
}

/**
 * Verifica se o usuário atual é admin
 */
export async function isCurrentUserAdmin() {
  const user = await getCurrentUser()
  return user?.role === 'ADMIN'
}

/**
 * Middleware helper para sincronizar usuário automaticamente
 * em rotas protegidas
 */
export async function ensureUserSynced() {
  const user = await syncCurrentUser()
  if (!user) {
    throw new Error('User not authenticated or failed to sync')
  }
  return user
}
