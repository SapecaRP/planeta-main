-- Add tipo_servico_personalizado column to contatos table
ALTER TABLE public.contatos 
ADD COLUMN tipo_servico_personalizado text;