
-- Pacientes
CREATE TABLE public.pacientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  cpf TEXT,
  data_nascimento TEXT,
  telefone TEXT,
  email TEXT,
  endereco TEXT,
  diabetes TEXT,
  hipertensao TEXT,
  medicamentos TEXT,
  alergias TEXT,
  problemas_pes TEXT,
  gestante TEXT,
  observacoes_clinicas TEXT,
  tipo_calcado TEXT,
  tipo_meia TEXT,
  cirurgia_membros_inferiores TEXT,
  cirurgia_membros_inferiores_qual TEXT,
  pratica_esporte TEXT,
  pratica_esporte_qual TEXT,
  toma_medicamento TEXT,
  toma_medicamento_qual TEXT,
  marca_passos_pinos TEXT,
  problemas_cancerigenos TEXT,
  pressao_alta TEXT,
  diabetes_condicao TEXT,
  convulsoes TEXT,
  problemas_circulatorios TEXT,
  alergia TEXT,
  observacoes_finais TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.pacientes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own_select_pacientes" ON public.pacientes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own_insert_pacientes" ON public.pacientes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_update_pacientes" ON public.pacientes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own_delete_pacientes" ON public.pacientes FOR DELETE USING (auth.uid() = user_id);

-- Agendamentos
CREATE TABLE public.agendamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  paciente_id UUID NOT NULL REFERENCES public.pacientes(id) ON DELETE CASCADE,
  data TEXT NOT NULL,
  horario TEXT NOT NULL,
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own_select_agendamentos" ON public.agendamentos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own_insert_agendamentos" ON public.agendamentos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_update_agendamentos" ON public.agendamentos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own_delete_agendamentos" ON public.agendamentos FOR DELETE USING (auth.uid() = user_id);

-- Estoque
CREATE TABLE public.estoque (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  quantidade INTEGER NOT NULL DEFAULT 0,
  quantidade_minima INTEGER NOT NULL DEFAULT 0,
  observacao TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.estoque ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own_select_estoque" ON public.estoque FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own_insert_estoque" ON public.estoque FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_update_estoque" ON public.estoque FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own_delete_estoque" ON public.estoque FOR DELETE USING (auth.uid() = user_id);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trg_pacientes_updated BEFORE UPDATE ON public.pacientes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_estoque_updated BEFORE UPDATE ON public.estoque
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
