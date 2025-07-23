import { useState, useEffect } from 'react';
import { Visita, VisitaFormData } from '../types';
import { supabase } from '../supabaseClient';

export function useVisitas() {
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    carregarVisitas();
  }, []);

  const carregarVisitas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('visitas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const visitasFormatadas = data.map(item => ({
        id: item.id,
        corretor: item.corretor_id,
        empreendimento: item.empreendimento_id,
        data: item.data_visita,
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
      const { data, error } = await supabase
        .from('visitas')
        .insert([
          {
            corretor_id: dados.corretor,
            empreendimento_id: dados.empreendimento,
            data_visita: dados.data,
            horario: dados.horario,
            status: 'agendada',
            observacoes: dados.observacoes || ''
          }
        ])
        .select()
        .single();

      if (error) throw error;

      const novaVisita: Visita = {
        id: data.id,
        corretor: data.corretor_id,
        empreendimento: data.empreendimento_id,
        data: data.data_visita,
        horario: data.horario,
        status: data.status,
        criadoEm: data.created_at.split('T')[0],
        observacoes: data.observacoes
      };

      setVisitas(prev => [novaVisita, ...prev]);
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
      if (dados.data) dadosAtualizados.data_visita = dados.data;
      if (dados.horario) dadosAtualizados.horario = dados.horario;
      if (dados.observacoes) dadosAtualizados.observacoes = dados.observacoes;
      
      const { data, error } = await supabase
        .from('visitas')
        .update(dadosAtualizados)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      const visitaAtualizada: Visita = {
        id: data.id,
        corretor: data.corretor_id,
        empreendimento: data.empreendimento_id,
        data: data.data_visita,
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