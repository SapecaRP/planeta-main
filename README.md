# Construtora Planeta - Sistema de Gestão de Produtos

Este é um sistema de gestão para a Construtora Planeta, desenvolvido com React, TypeScript, Tailwind CSS e Supabase.

## Funcionalidades

- **Autenticação**: Login, registro de administradores e solicitação de acesso para gerentes
- **Gestão de Empreendimentos**: Cadastro, edição e visualização de empreendimentos imobiliários
- **Gestão de Usuários**: Administração de usuários com diferentes níveis de acesso
- **Visitas**: Agendamento e acompanhamento de visitas aos empreendimentos
- **Manutenções**: Solicitação e acompanhamento de manutenções nos empreendimentos
- **Contatos**: Gerenciamento de prestadores de serviço
- **Atribuições**: Atribuição de empreendimentos a gerentes específicos

## Tecnologias Utilizadas

- React
- TypeScript
- Tailwind CSS
- Supabase (Banco de dados e autenticação)
- Vite (Build tool)

## Configuração do Ambiente

1. Clone o repositório
2. Instale as dependências:
   ```
   npm install
   ```
3. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
   ```
   VITE_SUPABASE_URL=sua_url_do_supabase
   VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
   ```
4. Inicie o servidor de desenvolvimento:
   ```
   npm run dev
   ```

## Estrutura do Projeto

- `/src/components`: Componentes reutilizáveis da UI
- `/src/contexts`: Contextos React, incluindo autenticação
- `/src/hooks`: Custom hooks para lógica de negócios
- `/src/pages`: Páginas principais da aplicação
- `/src/services`: Serviços para comunicação com APIs
- `/src/types`: Definições de tipos TypeScript
- `/src/supabaseClient.ts`: Configuração do cliente Supabase

## Banco de Dados

O projeto utiliza o Supabase como banco de dados. As migrações estão disponíveis na pasta `/supabase/migrations`.

## Licença

Este projeto é proprietário e seu uso é restrito à Construtora Planeta.
