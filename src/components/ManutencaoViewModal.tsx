import React, { useState } from 'react';
import { X, Calendar, User, AlertTriangle, CheckCircle, Image } from 'lucide-react';
import { Manutencao } from '../types';

interface ManutencaoViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  manutencao: Manutencao | null;
}

export function ManutencaoViewModal({ isOpen, onClose, manutencao }: ManutencaoViewModalProps) {
  const [imagemAberta, setImagemAberta] = useState<string | null>(null);

  if (!isOpen || !manutencao) return null;

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'baixa': return 'bg-green-100 text-green-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'alta': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-orange-100 text-orange-800';
      case 'concluida': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              Detalhes da Manutenção
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Cabeçalho com status e prioridade */}
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-lg font-medium text-gray-900">{manutencao.empreendimento}</h3>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPrioridadeColor(manutencao.prioridade)}`}>
                <AlertTriangle className="w-4 h-4 mr-1" />
                Prioridade {manutencao.prioridade}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(manutencao.status)}`}>
                {manutencao.status === 'concluida' ? (
                  <CheckCircle className="w-4 h-4 mr-1" />
                ) : (
                  <Calendar className="w-4 h-4 mr-1" />
                )}
                {manutencao.status === 'concluida' ? 'Concluída' : 'Pendente'}
              </span>
            </div>

            {/* Descrição */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Descrição do Problema</h4>
              <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">{manutencao.descricao}</p>
            </div>

            {/* Informações gerais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center text-sm text-gray-600">
                <User className="w-4 h-4 mr-2" />
                <span><strong>Gerente:</strong> {manutencao.gerente}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span><strong>Criado em:</strong> {formatDate(manutencao.criadoEm)}</span>
              </div>
              {manutencao.concluidoEm && (
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  <span><strong>Concluído em:</strong> {formatDate(manutencao.concluidoEm)}</span>
                </div>
              )}
            </div>

            {/* Fotos */}
            {manutencao.fotos && manutencao.fotos.length > 0 && (
              <div>
                <div className="flex items-center mb-4">
                  <Image className="w-5 h-5 mr-2 text-gray-500" />
                  <h4 className="text-sm font-medium text-gray-700">
                    Fotos do Problema ({manutencao.fotos.length})
                  </h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {manutencao.fotos.map((foto, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={foto}
                        alt={`Foto ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setImagemAberta(foto)}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                          Clique para ampliar
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end p-6 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>

      {/* Modal de visualização da imagem */}
      {imagemAberta && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[60] p-4" 
          onClick={() => setImagemAberta(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img 
              src={imagemAberta} 
              alt="Imagem ampliada" 
              className="max-w-full max-h-full rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setImagemAberta(null)}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}