
-- Criar tabela stamp_types
CREATE TABLE public.stamp_types (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Adicionar trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_stamp_types_updated_at
  BEFORE UPDATE ON public.stamp_types
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Habilitar RLS (Row Level Security) se necessário
ALTER TABLE public.stamp_types ENABLE ROW LEVEL SECURITY;

-- Criar policy para permitir acesso público (ajuste conforme necessário)
CREATE POLICY "Enable read access for all users" ON public.stamp_types
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON public.stamp_types
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON public.stamp_types
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON public.stamp_types
  FOR DELETE USING (true);
