ALTER TABLE public.estoque
  ADD COLUMN IF NOT EXISTS preco_custo numeric(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS preco_venda numeric(10,2) NOT NULL DEFAULT 0;