import { useState } from 'react';
import { Plus, BarChart3, Users, Building2, Target } from 'lucide-react';
import { AtribuicaoCard } from '../components/AtribuicaoCard';
import { AtribuicaoModal } from '../components/AtribuicaoModal';
import { useAtribuicoes } from '../hooks/useAtribuicoes';
import { AtribuicaoEmpreendimento } from '../types';

export function AtribuirProdutosPage() {
  const {
    atribuicoes,
    loading,
    atualizarAtribuicao,
    atualizarAtribuicaoLocal,
    getEmpreendimentosDisponiveis,
    getGerentesDisponiveis
  } = useAtribuicoes();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAtribuicao, setEditingAtribuicao] = useState<AtribuicaoEmpreendimento | undefined>();

  const empreendimentos = getEmpreendimentosDisponiveis();
  const gerentes = getGerentesDisponiveis();

  const handleCreateNew = () => {
    setEditingAtribuicao(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (atribuicao: AtribuicaoEmpreendimento) => {
    setEditingAtribuicao(atribuicao);
    setIsModalOpen(true);
  };

  const handleSave = (gerenteId: string, empreendimentoIds: string[]) => {
    atualizarAtribuicaoLocal(gerenteId, empreendimentoIds);
    atualizarAtribuicao(gerenteId, empreendimentoIds); // ✅ Salvar no Supabase
  };

  const handleSubmit = (gerenteId: string, empreendimentoIds: string[]) => {
    atualizarAtribuicao(gerenteId, empreendimentoIds);
  };

  const totalEmpreendimentos = empreendimentos.length;
  const empreendimentosAtribuidos = new Set(
    atribuicoes.flatMap(a => a.empreendimentos.map(e => e.id))
  ).size;
  const gerentesComAtribuicao = atribuicoes.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Atribuir Produtos
              </h1>
              <p className="text-lg text-gray-600">Gerencie a distribuição de empreendimentos entre os gerentes</p>
            </div>
            <button
              onClick={handleCreateNew}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nova Atribuição
            </button>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">{totalEmpreendimentos}</div>
                  <div className="text-sm text-gray-500">Total</div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Empreendimentos</h3>
              <p className="text-sm text-gray-600">Produtos disponíveis no sistema</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">{empreendimentosAtribuidos}</div>
                  <div className="text-sm text-gray-500">Atribuídos</div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Distribuídos</h3>
              <p className="text-sm text-gray-600">Empreendimentos já atribuídos</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-orange-600">{gerentesComAtribuicao}</div>
                  <div className="text-sm text-gray-500">Ativos</div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Gerentes</h3>
              <p className="text-sm text-gray-600">Com produtos atribuídos</p>
            </div>
          </div>
        </div>

        {/* Lista de Atribuições */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-lg mr-3">
                <BarChart3 className="w-5 h-5 text-gray-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Atribuições Ativas</h2>
            </div>
            <div className="text-sm text-gray-500">
              {atribuicoes.length} {atribuicoes.length === 1 ? 'atribuição' : 'atribuições'}
            </div>
          </div>

          {atribuicoes.length === 0 ? (
            <div className="text-center py-16">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma atribuição criada</h3>
              <p className="text-gray-500 mb-6">Comece criando sua primeira atribuição de produtos</p>
              <button
                onClick={handleCreateNew}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5 mr-2" />
                Criar Primeira Atribuição
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {atribuicoes.map((atribuicao) => (
                <AtribuicaoCard
                  key={atribuicao.id}
                  atribuicao={atribuicao}
                  onEdit={handleEdit}
                  onSave={handleSave}
                  empreendimentosDisponiveis={empreendimentos}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <AtribuicaoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        atribuicao={editingAtribuicao}
        gerentes={gerentes}
        empreendimentos={empreendimentos}
      />
    </div>
  );
}
