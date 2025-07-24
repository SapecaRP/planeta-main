import { useState } from 'react';
import { Edit, Trash2, Eye, Calendar, User, CheckCircle, Image } from 'lucide-react';
import { Manutencao } from '../types';

interface ManutencaoCardProps {
  manutencao: Manutencao;
  onEdit: (manutencao: Manutencao) => void;
  onDelete: (id: string) => void;
  onView: (manutencao: Manutencao) => void;
  onComplete?: (id: string) => void;
  isAdmin?: boolean;
}

export function ManutencaoCard({ manutencao, onEdit, onDelete, onView, onComplete, isAdmin = false }: ManutencaoCardProps) {
  const [imagemAberta, setImagemAberta] = useState<string | null>(null);

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'baixa': return 'bg-green-100 text-green-800';
      case 'media': return 'bg-yellow-10 min-w-[2.5rem]0 text-yellow-800';
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-3 sm:mb-4 space-y-2 sm:space-y-0">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">{manutencao.empreendimento}</h3>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPrioridadeColor(manutencao.prioridade)}`}>
                {manutencao.prioridade}
              </span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(manutencao.status)}`}>
                {manutencao.status}
              </span>
            </div>
            <p className="text-blue-600 text-xs sm:text-sm mb-3 hover:text-blue-800 cursor-pointer break-words" onClick={() => onView(manutencao)}>
              {manutencao.descricao}
            </p>
          </div>
          <div className="flex space-x-1 sm:space-x-2 ml-0 sm:ml-4">
            <button onClick={() => onView(manutencao)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Visualizar">
              <Eye className="w-4 h-4" />
            </button>
            {!isAdmin && (
              <>
                <button onClick={() => onEdit(manutencao)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => onDelete(manutencao.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="border-t pt-3 sm:pt-4 space-y-2 sm:space-y-3">
          {/* Fotos da manutenção */}
          {manutencao.fotos && manutencao.fotos.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center mb-2">
                <Image className="w-4 h-4 mr-1 text-gray-500" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">Fotos ({manutencao.fotos.length})</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {manutencao.fotos.slice(0, 3).map((foto, index) => (
                  <button
                    key={index}
                    onClick={() => setImagemAberta(foto)}
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors flex-shrink-0 relative"
                  >
                    <img
                      src={foto}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {index === 2 && manutencao.fotos && manutencao.fotos.length > 3 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-medium">
                          +{manutencao.fotos.length - 3}
                        </span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
            <div className="flex items-center text-xs sm:text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-1" />
              <span>Criado: {formatDate(manutencao.criadoEm)}</span>
            </div>
            {manutencao.concluidoEm && (
              <div className="flex items-center text-xs sm:text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                <span>Concluído: {formatDate(manutencao.concluidoEm)}</span>
              </div>
            )}
          </div>

          <div className="flex items-center text-xs sm:text-sm text-gray-600">
            <User className="w-4 h-4 mr-1" />
            <span>Gerente: {manutencao.gerente}</span>
          </div>

          {manutencao.status === 'pendente' && onComplete && !isAdmin && (
            <div className="pt-2 sm:pt-3">
              <button
                onClick={() => onComplete(manutencao.id)}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors text-xs sm:text-sm font-medium"
              >
                Marcar como Concluída
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de visualização da imagem */}
      {imagemAberta && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={() => setImagemAberta(null)}>
          <div className="relative max-w-full max-h-full">
            <button
              onClick={() => setImagemAberta(null)}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full p-1"
            >
              <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <img src={imagemAberta} alt="Imagem ampliada" className="max-w-full max-h-full rounded-lg shadow-lg object-contain" />
          </div>
        </div>
      )}
    </>
  );
}
