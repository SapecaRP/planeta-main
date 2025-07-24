-- Criar tipo enum para tipo_servico
CREATE TYPE public.tipo_servico AS ENUM (
  'Manutenção',
  'Limpeza',
  'Elétrica',
  'Hidráulica',
  'Pintura',
  'Jardinagem',
  'Segurança',
  'Facilities',
  'Outros'
);

-- Criar função para atualizar o updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar tabela contatos
CREATE TABLE public.contatos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  telefone text NOT NULL,
  tipo_servico public.tipo_servico NOT NULL DEFAULT 'Manutenção'::tipo_servico,
  tipo_servico_personalizado text NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT contatos_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

-- Criar trigger para atualizar updated_at
CREATE TRIGGER update_contatos_updated_at
BEFORE UPDATE ON contatos
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();