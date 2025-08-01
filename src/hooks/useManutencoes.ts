import { useState, useEffect } from 'react';
import { Manutencao, ManutencaoFormData } from '../types';
import { supabase } from '../supabaseClient';

export function useManutencoes() {
  const [manutencoes, setManutencoes] = useState<Manutencao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    carregarManutencoes();
  }, []);

  const carregarManutencoes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('manutencoes')
        .select(`
          *,
          empreendimentos(nome),
          usuarios(nome)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const manutencoesFormatadas = data.map(item => ({
        id: item.id,
        empreendimento: item.empreendimentos?.nome || 'Empreendimento não encontrado',
        descricao: item.descricao,
        status: item.status,
        prioridade: item.prioridade,
        gerente: item.usuarios?.nome || 'Gerente não encontrado',
        criadoEm: item.created_at.split('T')[0],
        concluidoEm: item.concluido_em?.split('T')[0],
        fotos: item.fotos || []
      }));

      setManutencoes(manutencoesFormatadas);
    } catch (error) {
      console.error('Erro ao carregar manutenções:', error);
      setError('Erro ao carregar manutenções');
      setManutencoes([]);
    } finally {
      setLoading(false);
    }
  };

  const criarManutencao = async (dados: ManutencaoFormData & { fotos?: string[] }) => {
    try {
      // Buscar o ID do empreendimento pelo nome
      const { data: empreendimentoData, error: empreendimentoError } = await supabase
        .from('empreendimentos')
        .select('id')
        .eq('nome', dados.empreendimento)
        .single();

      if (empreendimentoError) {
        throw new Error(`Empreendimento não encontrado: ${dados.empreendimento}`);
      }

      // Buscar o ID do gerente pelo nome
      const { data: gerenteData, error: gerenteError } = await supabase
        .from('usuarios')
        .select('id')
        .eq('nome', dados.gerente)
        .single();

      if (gerenteError) {
        throw new Error(`Gerente não encontrado: ${dados.gerente}`);
      }

      const { data, error } = await supabase
        .from('manutencoes')
        .insert([
          {
            empreendimento_id: empreendimentoData.id,
            descricao: dados.descricao,
            status: 'pendente',
            prioridade: dados.prioridade,
            gerente_id: gerenteData.id,
            fotos: dados.fotos || []
          }
        ])
        .select()
        .single();

      if (error) throw error;

      const novaManutencao: Manutencao = {
        id: data.id,
        empreendimento: dados.empreendimento,
        descricao: data.descricao,
        status: data.status,
        prioridade: data.prioridade,
        gerente: dados.gerente,
        criadoEm: data.created_at.split('T')[0],
        fotos: data.fotos || []
      };

      setManutencoes(prev => [novaManutencao, ...prev]);
      return novaManutencao;
    } catch (error) {
      console.error('Erro ao criar manutenção:', error);
      throw error;
    }
  };

  const atualizarManutencao = async (id: string, dados: Partial<Manutencao>) => {
    try {
      const dadosAtualizados: any = {};
      
      if (dados.status) dadosAtualizados.status = dados.status;
      if (dados.descricao) dadosAtualizados.descricao = dados.descricao;
      if (dados.prioridade) dadosAtualizados.prioridade = dados.prioridade;
      if (dados.gerente) dadosAtualizados.gerente_id = dados.gerente;
      if (dados.fotos !== undefined) dadosAtualizados.fotos = dados.fotos;
      
      // Se estiver concluindo a manutenção
      if (dados.status === 'concluida') {
        dadosAtualizados.concluido_em = new Date().toISOString();
      }
      
      const { data, error } = await supabase
        .from('manutencoes')
        .update(dadosAtualizados)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      // Buscar os nomes atualizados
      const { data: empreendimentoData } = await supabase
        .from('empreendimentos')
        .select('nome')
        .eq('id', data.empreendimento_id)
        .single();
      
      const { data: gerenteData } = await supabase
        .from('usuarios')
        .select('nome')
        .eq('id', data.gerente_id)
        .single();

      const manutencaoAtualizada: Manutencao = {
        id: data.id,
        empreendimento: empreendimentoData?.nome || 'Empreendimento não encontrado',
        descricao: data.descricao,
        status: data.status,
        prioridade: data.prioridade,
        gerente: gerenteData?.nome || 'Gerente não encontrado',
        criadoEm: data.created_at.split('T')[0],
        concluidoEm: data.concluido_em?.split('T')[0],
        fotos: data.fotos || []
      };
      
      setManutencoes(prev => 
        prev.map(manutencao => 
          manutencao.id === id 
            ? manutencaoAtualizada
            : manutencao
        )
      );
      
      return manutencaoAtualizada;
    } catch (error) {
      console.error('Erro ao atualizar manutenção:', error);
      throw error;
    }
  };

  const concluirManutencao = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('manutencoes')
        .update({
          status: 'concluida',
          concluido_em: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      // Buscar os nomes atualizados
      const { data: empreendimentoData } = await supabase
        .from('empreendimentos')
        .select('nome')
        .eq('id', data.empreendimento_id)
        .single();
      
      const { data: gerenteData } = await supabase
        .from('usuarios')
        .select('nome')
        .eq('id', data.gerente_id)
        .single();

      const manutencaoAtualizada: Manutencao = {
        id: data.id,
        empreendimento: empreendimentoData?.nome || 'Empreendimento não encontrado',
        descricao: data.descricao,
        status: data.status,
        prioridade: data.prioridade,
        gerente: gerenteData?.nome || 'Gerente não encontrado',
        criadoEm: data.created_at.split('T')[0],
        concluidoEm: data.concluido_em?.split('T')[0],
        fotos: data.fotos || []
      };
      
      setManutencoes(prev => 
        prev.map(manutencao => 
          manutencao.id === id 
            ? manutencaoAtualizada
            : manutencao
        )
      );
      
      return manutencaoAtualizada;
    } catch (error) {
      console.error('Erro ao concluir manutenção:', error);
      throw error;
    }
  };
  
  const excluirManutencao = async (id: string) => {
    try {
      const { error } = await supabase
        .from('manutencoes')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setManutencoes(prev => prev.filter(manutencao => manutencao.id !== id));
    } catch (error) {
      console.error('Erro ao excluir manutenção:', error);
      throw error;
    }
  };

  const estatisticas = {
    total: manutencoes.length,
    pendentes: manutencoes.filter(m => m.status === 'pendente').length,
    concluidas: manutencoes.filter(m => m.status === 'concluida').length
  };

  return {
    manutencoes,
    loading,
    error,
    estatisticas,
    criarManutencao,
    atualizarManutencao,
    concluirManutencao,
    excluirManutencao,
    carregarManutencoes
  };
}
