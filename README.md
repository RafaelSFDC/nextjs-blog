# Blog Moderno com Next.js

Um blog completo e moderno construído com Next.js 15, Prisma, Clerk e Tailwind CSS.

## 🚀 Funcionalidades

### ✅ **Funcionalidades Implementadas:**

- **🏠 Homepage** - Landing page atrativa
- **📝 Blog** - Listagem de posts com filtros e paginação
- **📖 Posts Individuais** - Visualização completa de posts com comentários
- **🔐 Autenticação** - Sistema completo com Clerk (login/registro)
- **👨‍💼 Dashboard Admin** - Painel administrativo completo
- **📊 Analytics** - Estatísticas do blog
- **💬 Sistema de Comentários** - Comentários com moderação
- **🏷️ Categorias e Tags** - Organização de conteúdo
- **🎨 Design Responsivo** - Interface moderna com Shadcn/ui
- **🌙 Dark/Light Mode** - Tema claro e escuro

### 📋 **Páginas do Dashboard:**

- **📊 Dashboard Principal** - Estatísticas e visão geral
- **📝 Gerenciar Posts** - CRUD completo de posts
- **🏷️ Gerenciar Categorias** - CRUD de categorias
- **💬 Moderar Comentários** - Aprovar/rejeitar comentários
- **📈 Analytics** - Métricas e relatórios

### 🔧 **APIs Implementadas:**

- **Posts** - CRUD completo com filtros e busca
- **Categorias** - CRUD completo
- **Tags** - CRUD completo
- **Comentários** - CRUD com moderação
- **Usuários** - Sincronização com Clerk
- **Dashboard** - Estatísticas e métricas

## 🛠️ Tecnologias

- **[Next.js 15](https://nextjs.org/)** - Framework React
- **[Prisma](https://prisma.io/)** - ORM TypeScript
- **[Clerk](https://clerk.com/)** - Autenticação
- **[Neon](https://neon.tech/)** - Banco PostgreSQL
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling
- **[Shadcn/ui](https://ui.shadcn.com/)** - Componentes UI
- **[TypeScript](https://typescriptlang.org/)** - Type Safety
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications

## 📦 Instalação

1. **Clone o repositório:**
   ```bash
   git clone <repository-url>
   cd nextjs-blog
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure o banco de dados:**
   ```bash
   npm run db:push
   npm run db:generate
   ```

5. **Popule o banco com dados de exemplo:**
   ```bash
   npm run db:seed
   ```

6. **Execute o projeto:**
   ```bash
   npm run dev
   ```

## ⚙️ Configuração

### 🗄️ Banco de Dados (Neon)

1. Crie uma conta no [Neon](https://neon.tech/)
2. Crie um novo projeto
3. Copie a URL de conexão para `.env.local`:
   ```env
   DATABASE_URL="postgresql://..."
   ```

### 🔐 Autenticação (Clerk)

1. Crie uma conta no [Clerk](https://clerk.com/)
2. Crie uma nova aplicação
3. Configure as variáveis no `.env.local`:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   CLERK_WEBHOOK_SECRET=whsec_...
   ```

4. **Configure o webhook no Clerk:**
   - URL: `https://seu-dominio.com/api/webhooks/clerk`
   - Eventos: `user.created`, `user.updated`, `user.deleted`

## 📁 Estrutura do Projeto

```
├── app/
│   ├── (admin)/dashboard/          # Páginas do dashboard
│   ├── (auth)/                     # Páginas de autenticação
│   ├── (blog)/blog/                # Páginas do blog
│   ├── api/                        # Rotas da API
│   └── globals.css                 # Estilos globais
├── components/
│   ├── ui/                         # Componentes Shadcn/ui
│   └── theme-provider.tsx          # Provider de tema
├── lib/
│   ├── prisma.ts                   # Cliente Prisma
│   ├── utils.ts                    # Utilitários
│   └── validations/                # Schemas de validação
├── prisma/
│   └── schema.prisma               # Schema do banco
├── scripts/
│   └── seed.ts                     # Script de seed
└── types/
    └── blog.ts                     # Types TypeScript
```

## 🎯 Como Usar

### 👤 **Como Usuário:**

1. **Navegar pelo blog** - Visualize posts na página `/blog`
2. **Ler posts** - Clique em qualquer post para ler
3. **Comentar** - Faça login e deixe comentários
4. **Filtrar** - Use categorias e busca para encontrar conteúdo

### 👨‍💼 **Como Admin:**

1. **Acesse o dashboard** - Vá para `/dashboard`
2. **Crie posts** - Use o editor para criar conteúdo
3. **Gerencie categorias** - Organize o conteúdo
4. **Modere comentários** - Aprove ou rejeite comentários
5. **Veja analytics** - Acompanhe métricas do blog

## 🚀 Deploy

### Vercel (Recomendado)

1. **Conecte seu repositório** no Vercel
2. **Configure as variáveis de ambiente**
3. **Deploy automático** a cada push

### Outras plataformas

O projeto é compatível com qualquer plataforma que suporte Next.js:
- Netlify
- Railway
- Render
- AWS
- Google Cloud

## 📝 Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # Linting
npm run db:push      # Aplicar schema ao banco
npm run db:generate  # Gerar cliente Prisma
npm run db:seed      # Popular banco com dados
npm run db:studio    # Abrir Prisma Studio
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

---

**Desenvolvido com ❤️ usando Next.js, Prisma e Clerk**
