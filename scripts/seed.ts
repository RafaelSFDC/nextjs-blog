import { PrismaClient, PostStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Criar categorias
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'tecnologia' },
      update: {},
      create: {
        name: 'Tecnologia',
        slug: 'tecnologia',
        description: 'Posts sobre tecnologia, programação e inovação',
        color: '#3b82f6',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'design' },
      update: {},
      create: {
        name: 'Design',
        slug: 'design',
        description: 'Posts sobre design, UX/UI e criatividade',
        color: '#8b5cf6',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'tutorial' },
      update: {},
      create: {
        name: 'Tutorial',
        slug: 'tutorial',
        description: 'Tutoriais passo a passo e guias práticos',
        color: '#10b981',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'noticias' },
      update: {},
      create: {
        name: 'Notícias',
        slug: 'noticias',
        description: 'Últimas notícias do mundo tech',
        color: '#f59e0b',
      },
    }),
  ])

  console.log('✅ Categorias criadas:', categories.length)

  // Criar tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: 'nextjs' },
      update: {},
      create: {
        name: 'Next.js',
        slug: 'nextjs',
        color: '#000000',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'react' },
      update: {},
      create: {
        name: 'React',
        slug: 'react',
        color: '#61dafb',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'typescript' },
      update: {},
      create: {
        name: 'TypeScript',
        slug: 'typescript',
        color: '#3178c6',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'prisma' },
      update: {},
      create: {
        name: 'Prisma',
        slug: 'prisma',
        color: '#2d3748',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'tailwind' },
      update: {},
      create: {
        name: 'Tailwind CSS',
        slug: 'tailwind',
        color: '#06b6d4',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'javascript' },
      update: {},
      create: {
        name: 'JavaScript',
        slug: 'javascript',
        color: '#f7df1e',
      },
    }),
  ])

  console.log('✅ Tags criadas:', tags.length)

  // Criar usuário admin (se não existir)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@blog.com' },
    update: {},
    create: {
      clerkId: 'admin_clerk_id',
      email: 'admin@blog.com',
      firstName: 'Admin',
      lastName: 'Blog',
      role: 'ADMIN',
    },
  })

  console.log('✅ Usuário admin criado:', adminUser.email)

  // Criar posts de exemplo
  const posts = [
    {
      title: 'Como construir um blog moderno com Next.js',
      slug: 'como-construir-blog-moderno-nextjs',
      excerpt: 'Aprenda a criar um blog completo usando Next.js, Prisma e Clerk para autenticação. Este tutorial aborda desde a configuração inicial até o deploy.',
      content: `# Como construir um blog moderno com Next.js

Neste tutorial completo, vamos aprender como construir um blog moderno usando Next.js, uma das frameworks mais populares do React.

## Por que Next.js?

Next.js oferece várias vantagens para desenvolvimento web moderno:

- Server-side rendering (SSR) out of the box
- Static site generation (SSG)
- Roteamento automático baseado em arquivos
- Otimizações de performance automáticas
- Suporte nativo ao TypeScript

## Configuração do Projeto

Primeiro, vamos criar um novo projeto Next.js:

\`\`\`bash
npx create-next-app@latest meu-blog --typescript --tailwind --eslint
\`\`\`

Este comando criará um novo projeto com TypeScript, Tailwind CSS e ESLint já configurados.

## Estrutura do Projeto

A estrutura básica do nosso blog será:

- \`app/\` - Páginas e layouts (App Router)
- \`components/\` - Componentes reutilizáveis
- \`lib/\` - Utilitários e configurações
- \`prisma/\` - Schema do banco de dados

## Conclusão

Com Next.js, conseguimos criar um blog moderno, rápido e otimizado para SEO. As ferramentas integradas facilitam muito o desenvolvimento e a manutenção do projeto.`,
      status: PostStatus.PUBLISHED,
      featured: true,
      categoryId: categories[0].id, // Tecnologia
      tagIds: [tags[0].id, tags[1].id, tags[2].id], // Next.js, React, TypeScript
    },
    {
      title: 'Guia completo do Prisma ORM',
      slug: 'guia-completo-prisma-orm',
      excerpt: 'Descubra como usar o Prisma ORM para gerenciar seu banco de dados de forma eficiente e type-safe.',
      content: `# Guia completo do Prisma ORM

O Prisma é um ORM moderno que facilita o trabalho com bancos de dados em aplicações TypeScript e JavaScript.

## Principais características

- Type-safety completa
- Auto-completion inteligente
- Migrations automáticas
- Query builder intuitivo

## Instalação

\`\`\`bash
npm install prisma @prisma/client
npx prisma init
\`\`\`

## Configuração básica

Defina seu schema no arquivo \`schema.prisma\`:

\`\`\`prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  content   String?
  published Boolean @default(false)
  author    User    @relation(fields: [authorId], references: [id])
  authorId  Int
}
\`\`\`

## Conclusão

O Prisma torna o desenvolvimento com banco de dados muito mais produtivo e seguro.`,
      status: PostStatus.PUBLISHED,
      featured: false,
      categoryId: categories[2].id, // Tutorial
      tagIds: [tags[3].id, tags[2].id], // Prisma, TypeScript
    },
    {
      title: 'Design System com Tailwind CSS',
      slug: 'design-system-tailwind-css',
      excerpt: 'Aprenda a criar um design system consistente usando Tailwind CSS e componentes reutilizáveis.',
      content: `# Design System com Tailwind CSS

Um design system bem estruturado é fundamental para manter consistência visual em aplicações web.

## Vantagens do Tailwind CSS

- Utility-first approach
- Customização completa
- Performance otimizada
- Desenvolvimento rápido

## Configuração

Instale o Tailwind CSS:

\`\`\`bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
\`\`\`

## Criando componentes

\`\`\`tsx
const Button = ({ variant = 'primary', children, ...props }) => {
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-colors'
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
  }

  return (
    <button
      className={\`\${baseClasses} \${variants[variant]}\`}
      {...props}
    >
      {children}
    </button>
  )
}
\`\`\`

## Conclusão

O Tailwind CSS permite criar design systems flexíveis e maintíveis.`,
      status: PostStatus.PUBLISHED,
      featured: true,
      categoryId: categories[1].id, // Design
      tagIds: [tags[4].id], // Tailwind CSS
    },
    {
      title: 'JavaScript ES2024: Novas funcionalidades',
      slug: 'javascript-es2024-novas-funcionalidades',
      excerpt: 'Conheça as principais novidades do JavaScript ES2024 e como elas podem melhorar seu código.',
      content: `# JavaScript ES2024: Novas funcionalidades

O JavaScript continua evoluindo com novas funcionalidades que tornam o desenvolvimento mais eficiente.

## Array.prototype.toSorted()

Uma versão imutável do método sort():

\`\`\`javascript
const numbers = [3, 1, 4, 1, 5]
const sorted = numbers.toSorted() // [1, 1, 3, 4, 5]
console.log(numbers) // [3, 1, 4, 1, 5] - original inalterado
\`\`\`

## Object.groupBy()

Agrupa elementos de um array:

\`\`\`javascript
const people = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Charlie', age: 25 }
]

const grouped = Object.groupBy(people, person => person.age)
// { 25: [Alice, Charlie], 30: [Bob] }
\`\`\`

## Promise.withResolvers()

Nova forma de criar promises:

\`\`\`javascript
const { promise, resolve, reject } = Promise.withResolvers()

// Use resolve/reject em qualquer lugar
setTimeout(() => resolve('Done!'), 1000)
\`\`\`

## Conclusão

Essas novas funcionalidades tornam o JavaScript ainda mais poderoso e expressivo.`,
      status: PostStatus.DRAFT,
      featured: false,
      categoryId: categories[0].id, // Tecnologia
      tagIds: [tags[5].id], // JavaScript
    },
  ]

  for (const postData of posts) {
    const { tagIds, ...post } = postData

    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        ...post,
        authorId: adminUser.id,
        publishedAt: post.status === PostStatus.PUBLISHED ? new Date() : null,
        tags: {
          connect: tagIds.map(id => ({ id }))
        }
      },
    })
  }

  console.log('✅ Posts criados:', posts.length)

  console.log('🎉 Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
