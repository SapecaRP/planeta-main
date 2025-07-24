import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useEmpreendimentos } from '../hooks/useEmpreendimentos';
import { EmpreendimentoViewModal } from '../components/EmpreendimentoViewModal';
import { Empreendimento } from '../types';

interface EmpreendimentosViewPageProps {
  onBack: () => void;
  onEmpreendimentoClick: () => void;
}

export function EmpreendimentosViewPage({ onBack, onEmpreendimentoClick }: EmpreendimentosViewPageProps) {
  const { empreendimentos, loading } = useEmpreendimentos();
  const [selectedEmpreendimento, setSelectedEmpreendimento] = useState<Empreendimento | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEmpreendimentoClick = (empreendimento: Empreendimento) => {
    setSelectedEmpreendimento(empreendimento);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEmpreendimento(null);
  };

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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-green-600 hover:text-green-700 mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Voltar ao Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Nossos Empreendimentos
          </h1>
        </div>
      </div>

      {empreendimentos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum empreendimento cadastrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {empreendimentos.map((empreendimento) => (
            <div
              key={empreendimento.id}
              onClick={() => handleEmpreendimentoClick(empreendimento)}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 overflow-hidden group"
            >
              <div className="h-48 overflow-hidden bg-gray-200 relative">
                {empreendimento.foto ? (
                  <img 
                    src={empreendimento.foto} 
                    alt={empreendimento.nome}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200">
                    <span className="text-green-600 text-lg font-medium">
                      {empreendimento.nome.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <span className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Clique para ver detalhes
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 text-center group-hover:text-green-600 transition-colors">
                  {empreendimento.nome}
                </h3>
              </div>
            </div>
          ))}
        </div>
      )}

      <EmpreendimentoViewModal
        empreendimento={selectedEmpreendimento}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </main>
  );
}
