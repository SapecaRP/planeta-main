import { useState, useEffect } from 'react';
import { Visita, VisitaFormData } from '../types';
import { supabase } from '../supabaseClient';

export function useVisitas() {
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    carregarVisitas();
  }, [refreshKey]);

  const carregarVisitas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('visitas')
        .select(`
          *,
          empreendimentos!visitas_empreendimento_id_fkey(nome)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const visitasFormatadas = data.map(item => ({
        id: item.id,
        corretor: item.corretor || 'Corretor não encontrado',
        empreendimento: item.empreendimentos?.nome || 'Empreendimento não encontrado',
        data: item.data,
        horario: item.horario,
        status: item.status,
        criadoEm: item.created_at.split('T')[0],
        observacoes: item.observacoes
      }));

      setVisitas(visitasFormatadas);
    } catch (error) {
      console.error('Erro ao carregar visitas:', error);
      setError('Erro ao carregar visitas');
      setVisitas([]);
    } finally {
      setLoading(false);
    }
  };

  const criarVisita = async (dados: VisitaFormData) => {
    try {
      // Buscar ID do empreendimento pelo nome
      const { data: empreendimentoData, error: empreendimentoError } = await supabase
        .from('empreendimentos')
        .select('id')
        .eq('nome', dados.empreendimento)
        .single();

      if (empreendimentoError) {
        throw new Error(`Empreendimento não encontrado: ${empreendimentoError.message}`);
      }

      const dadosInsercao = {
        corretor: dados.corretor,
        empreendimento_id: empreendimentoData.id,
        data: dados.data,
        horario: dados.horario,
        status: 'agendada',
        observacoes: dados.observacoes || ''
      };

      const { data, error } = await supabase
        .from('visitas')
        .insert([dadosInsercao])
        .select()
        .single();

      if (error) throw error;

      const novaVisita: Visita = {
        id: data.id,
        corretor: data.corretor,
        empreendimento: dados.empreendimento,
        data: data.data,
        horario: data.horario,
        status: data.status,
        criadoEm: data.created_at.split('T')[0],
        observacoes: data.observacoes
      };
      
      // Recarregar a lista completa de visitas após criar uma nova
      await carregarVisitas();
      
      // Forçar atualização do estado
      setRefreshKey(prev => prev + 1);
      
      return novaVisita;
    } catch (error) {
      console.error('Erro ao criar visita:', error);
      throw error;
    }
  };

  const atualizarVisita = async (id: string, dados: Partial<Visita>) => {
    try {
      const dadosAtualizados: any = {};
      
      if (dados.status) dadosAtualizados.status = dados.status;
      if (dados.data) dadosAtualizados.data = dados.data;
      if (dados.horario) dadosAtualizados.horario = dados.horario;
      if (dados.observacoes) dadosAtualizados.observacoes = dados.observacoes;
      if (dados.corretor) dadosAtualizados.corretor = dados.corretor;
      
      const { data, error } = await supabase
        .from('visitas')
        .update(dadosAtualizados)
        .eq('id', id)
        .select(`
          *,
          empreendimentos!visitas_empreendimento_id_fkey(nome)
        `)
        .single();
        
      if (error) throw error;
      
      const visitaAtualizada: Visita = {
        id: data.id,
        corretor: data.corretor || 'Corretor não encontrado',
        empreendimento: data.empreendimentos?.nome || 'Empreendimento não encontrado',
        data: data.data,
        horario: data.horario,
        status: data.status,
        criadoEm: data.created_at.split('T')[0],
        observacoes: data.observacoes
      };
      
      setVisitas(prev => 
        prev.map(visita => 
          visita.id === id 
            ? visitaAtualizada
            : visita
        )
      );
      
      return visitaAtualizada;
    } catch (error) {
      console.error('Erro ao atualizar visita:', error);
      throw error;
    }
  };

  const marcarComoRealizada = async (id: string) => {
    return await atualizarVisita(id, { status: 'realizada' });
  };

  const excluirVisita = async (id: string) => {
    try {
      const { error } = await supabase
        .from('visitas')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setVisitas(prev => prev.filter(visita => visita.id !== id));
    } catch (error) {
      console.error('Erro ao excluir visita:', error);
      throw error;
    }
  };

  const estatisticas = {
    total: visitas.length,
    agendadas: visitas.filter(v => v.status === 'agendada').length,
    realizadas: visitas.filter(v => v.status === 'realizada').length,
    canceladas: visitas.filter(v => v.status === 'cancelada').length
  };

  return {
    visitas,
    loading,
    error,
    estatisticas,
    criarVisita,
    atualizarVisita,
    marcarComoRealizada,
    excluirVisita,
    carregarVisitas
  };
}
