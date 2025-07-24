import { useState, useEffect } from 'react';
import { Contato, ContatoFormData } from '../types';
import { supabase } from '../supabaseClient';

const TIPOS_SERVICO_PADRAO = ['Manutenção', 'Limpeza', 'Elétrica', 'Hidráulica', 'Pintura', 'Jardinagem', 'Segurança', 'Facilities'] as const;

export function useContatos() {
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarContatos();
  }, []);

  const carregarContatos = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('contatos').select('*');
    if (error) {
      console.error('Erro ao carregar contatos:', error);
      setContatos([]);
    } else {
      const contatosConvertidos = data.map((c: any) => ({
        ...c,
        tipoServico: c.tipo_servico, // conversão aqui
        tipoServicoPersonalizado: c.tipo_servico_personalizado
      }));
      setContatos(contatosConvertidos);
    }
    setLoading(false);
  };

  const criarContato = async (dados: ContatoFormData) => {
    // Validar se o tipo de serviço é um valor válido do enum
    const tipo_servico = TIPOS_SERVICO_PADRAO.includes(dados.tipoServico as any) ? dados.tipoServico : 'Outros';
    
    const payload: any = {
      nome: dados.nome,
      telefone: dados.telefone,
      tipo_servico
    };
    
    // Se for "Outros", salvar o tipo personalizado
    if (dados.tipoServico === 'Outros' && dados.tipoServicoPersonalizado) {
      payload.tipo_servico_personalizado = dados.tipoServicoPersonalizado;
    }

    const { data, error } = await supabase
      .from('contatos')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar contato:', error.message);
      throw error;
    }

    // Recarregar a lista de contatos após criar um novo
    await carregarContatos();

    return data;
  };

  const atualizarContato = async (id: string, dados: Partial<ContatoFormData>) => {
    const payload: any = {};
    if (dados.nome) payload.nome = dados.nome;
    if (dados.telefone) payload.telefone = dados.telefone;
    if (dados.tipoServico) {
      payload.tipo_servico = TIPOS_SERVICO_PADRAO.includes(dados.tipoServico as any) ? dados.tipoServico : 'Outros';
      
      // Se for "Outros", salvar o tipo personalizado
      if (dados.tipoServico === 'Outros' && dados.tipoServicoPersonalizado) {
        payload.tipo_servico_personalizado = dados.tipoServicoPersonalizado;
      } else if (dados.tipoServico !== 'Outros') {
        // Se não for "Outros", limpar o campo personalizado
        payload.tipo_servico_personalizado = null;
      }
    }

    const { data, error } = await supabase
      .from('contatos')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar contato:', error.message);
      throw error;
    }

    // Recarregar a lista de contatos após atualizar
    await carregarContatos();

    return data;
  };

  const excluirContato = async (id: string) => {
    const { error } = await supabase.from('contatos').delete().eq('id', id);

    if (error) {
      console.error('Erro ao excluir contato:', error.message);
      throw error;
    }

    // Recarregar a lista de contatos após excluir
    await carregarContatos();
  };

  return {
    contatos,
    loading,
    criarContato,
    atualizarContato,
    excluirContato,
    carregarContatos
  };
}
