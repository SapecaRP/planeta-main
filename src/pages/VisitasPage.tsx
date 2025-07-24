import React, { useState, useMemo, useEffect } from 'react';
import { Filter, Calendar } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { VisitaCard } from '../components/VisitaCard';
import { VisitaModal } from '../components/VisitaModal';
import { useVisitas } from '../hooks/useVisitas';
import { useAuth } from '../contexts/AuthContext';
import { useAtribuicoes } from '../hooks/useAtribuicoes';
import { Visita, VisitaFormData } from '../types';

export const VisitasPage = () => {
  const { user } = useAuth();
  const { visitas, loading, marcarComoRealizada, excluirVisita, carregarVisitas, atualizarVisita } = useVisitas();
  const { atribuicoes, loading: loadingAtribuicoes } = useAtribuicoes();
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEmpreendimento, setFiltroEmpreendimento] = useState('');
  const [filtroCorretor, setFiltroCorretor] = useState('');
  const [filtroDataInicio, setFiltroDataInicio] = useState('');
  const [filtroDataFim, setFiltroDataFim] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingVisita, setEditingVisita] = useState<Visita | null>(null);

  const isAdmin = user?.cargo === 'Administrador';

  useEffect(() => {
    carregarVisitas();
  }, []);

  const visitasPermitidas = useMemo(() => {
    if (isAdmin) return visitas;
    if (loadingAtribuicoes) return [];
    const minhaAtribuicao = atribuicoes.find(a => a.gerenteId === user?.id);
    if (!minhaAtribuicao) return [];
    const nomesEmpreendimentosAtribuidos = minhaAtribuicao.empreendimentos.map(e => e.nome);
    return visitas.filter(v => nomesEmpreendimentosAtribuidos.includes(v.empreendimento));
  }, [visitas, atribuicoes, user?.id, isAdmin, loadingAtribuicoes]);

  const visitasFiltradas = useMemo(() => {
    return visitasPermitidas.filter(visita => {
      const matchesSearch = visita.corretor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            visita.empreendimento.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesEmpreendimento = !filtroEmpreendimento || visita.empreendimento === filtroEmpreendimento;
      // Verificar se o filtro de gerente corresponde ao gerente responsável pelo empreendimento
      const gerenteResponsavel = atribuicoes.find(a => 
        a.empreendimentos.some(emp => emp.nome === visita.empreendimento)
      )?.gerenteNome;
      const matchesCorretor = !filtroCorretor || gerenteResponsavel === filtroCorretor;
      // Verificar se a data da visita está dentro do período selecionado
      const dataVisita = new Date(visita.data);
      const matchesDataInicio = !filtroDataInicio || dataVisita >= new Date(filtroDataInicio);
      const matchesDataFim = !filtroDataFim || dataVisita <= new Date(filtroDataFim);
      const matchesData = matchesDataInicio && matchesDataFim;
      return matchesSearch && matchesEmpreendimento && matchesCorretor && matchesData;
    });
  }, [visitasPermitidas, searchTerm, filtroEmpreendimento, filtroCorretor, filtroDataInicio, filtroDataFim]);

  const empreendimentos = [...new Set(visitasPermitidas.map(v => v.empreendimento))];
  
  // Obter gerentes responsáveis pelos empreendimentos das visitas
  const gerentes = useMemo(() => {
    const gerentesSet = new Set<string>();
    visitasPermitidas.forEach(visita => {
      // Encontrar o gerente responsável pelo empreendimento da visita
      const atribuicao = atribuicoes.find(a => 
        a.empreendimentos.some(emp => emp.nome === visita.empreendimento)
      );
      if (atribuicao) {
        gerentesSet.add(atribuicao.gerenteNome);
      }
    });
    return Array.from(gerentesSet);
  }, [visitasPermitidas, atribuicoes]);

  const handleEdit = (visita: Visita) => {
    setEditingVisita(visita);
    setIsEditModalOpen(true);
  };

  const handleUpdateVisita = async (data: VisitaFormData) => {
    if (editingVisita) {
      await atualizarVisita(editingVisita.id, data);
      setIsEditModalOpen(false);
      setEditingVisita(null);
      carregarVisitas();
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta visita?')) {
      excluirVisita(id);
    }
  };

  const handleMarkAsCompleted = async (id: string) => {
    if (window.confirm('Marcar esta visita como realizada?')) {
      try {
        await marcarComoRealizada(id);
        carregarVisitas(); // Recarregar a lista após marcar como realizada
      } catch (error) {
        console.error('Erro ao marcar visita como realizada:', error);
        alert('Erro ao marcar visita como realizada. Tente novamente.');
      }
    }
  };

  if (loading || loadingAtribuicoes) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {isAdmin ? 'Visitas Agendadas' : 'Minhas Visitas'}
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900">Filtros</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
            <div>
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Buscar gerente ou empreendimento..."
              />
            </div>

            <div>
              <select
                value={filtroEmpreendimento}
                onChange={(e) => setFiltroEmpreendimento(e.target.value)}
                className="w-full px-2 sm:px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Todos os Empreendimentos</option>
                {empreendimentos.map(emp => (
                  <option key={emp} value={emp}>{emp}</option>
                ))}
              </select>
            </div>

            {isAdmin && (
              <div>
                <select
                  value={filtroCorretor}
                  onChange={(e) => setFiltroCorretor(e.target.value)}
                  className="w-full px-2 sm:px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Todos os Gerentes</option>
                  {gerentes.map(gerente => (
                    <option key={gerente} value={gerente}>{gerente}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <input
                type="date"
                value={filtroDataInicio}
                onChange={(e) => setFiltroDataInicio(e.target.value)}
                placeholder="Data início"
                className="w-full px-2 sm:px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <input
                type="date"
                value={filtroDataFim}
                onChange={(e) => setFiltroDataFim(e.target.value)}
                placeholder="Data fim"
                className="w-full px-2 sm:px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
        </div>
      </div>

      {visitasFiltradas.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchTerm || filtroEmpreendimento || filtroCorretor || filtroDataInicio || filtroDataFim 
              ? 'Nenhuma visita encontrada com os filtros aplicados' 
              : 'Nenhuma visita agendada'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {visitasFiltradas.map((visita) => (
            <VisitaCard
              key={visita.id}
              visita={visita}
              onMarkAsCompleted={handleMarkAsCompleted}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}

      <VisitaModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingVisita(null);
        }}
        onSubmit={handleUpdateVisita}
        empreendimento={editingVisita?.empreendimento || ''}
        empreendimentos={empreendimentos}
        initialData={editingVisita ? {
          corretor: editingVisita.corretor,
          empreendimento: editingVisita.empreendimento,
          data: editingVisita.data,
          horario: editingVisita.horario,
          observacoes: editingVisita.observacoes || ''
        } : undefined}
      />
    </main>
  );
};
