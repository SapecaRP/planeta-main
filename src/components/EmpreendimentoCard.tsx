import React from 'react';
import { Edit, Trash2, MapPin, Calendar } from 'lucide-react';
import { Empreendimento } from '../types';

interface EmpreendimentoCardProps {
  empreendimento: Empreendimento;
  onEdit?: (empreendimento: Empreendimento) => void;
  onDelete?: (id: string) => void;
  onCardClick?: (empreendimento: Empreendimento) => void;
  readOnly?: boolean;
}

export function EmpreendimentoCard({ empreendimento, onEdit, onDelete, onCardClick, readOnly = false }: EmpreendimentoCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Estoque':
        return 'bg-blue-100 text-blue-800';
      case 'STAND':
        return 'bg-yellow-100 text-yellow-800';
      case 'PDV':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const openGoogleMaps = (e: React.MouseEvent) => {
    e.stopPropagation();
    const encodedAddress = encodeURIComponent(empreendimento.endereco);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(googleMapsUrl, '_blank');
  };

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(empreendimento);
    }
  };

  console.log('Empreendimento foto:', empreendimento.foto); // Debug
  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-[1.02]"
      onClick={handleCardClick}
    >
      {empreendimento.foto && (
        <div className="h-32 sm:h-48 overflow-hidden">
          <img 
            src={empreendimento.foto} 
            alt={empreendimento.nome}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error('Erro ao carregar imagem:', empreendimento.foto);
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-start justify-between mb-3 sm:mb-4 space-y-2 sm:space-y-0">
          <div className="flex-1 min-w-0 w-full sm:w-auto">
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-2 break-words">{empreendimento.nome}</h3>
            <div className="flex items-start text-gray-600 mb-2">
              <button
                onClick={openGoogleMaps}
                className="flex items-start flex-1 mr-2 hover:text-blue-600 transition-colors group"
                title="Clique para abrir no Google Maps"
              >
                <MapPin className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0 group-hover:text-blue-600" />
                <span className="text-xs sm:text-sm break-words group-hover:text-blue-600">{empreendimento.endereco}</span>
              </button>
            </div>
            <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(empreendimento.status)}`}>
              {empreendimento.status}
            </span>
          </div>
          {!readOnly && (
            <div className="flex space-x-1 sm:space-x-2 flex-shrink-0 self-start">
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(empreendimento);
                  }}
                  className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(empreendimento.id);
                  }}
                  className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Excluir"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        <div className="border-t pt-3 sm:pt-4">
          <h4 className="text-xs sm:text-sm font-medium text-gray-900 mb-2">INFORMAÇÕES:</h4>
          <div className="text-xs sm:text-sm text-gray-600 whitespace-pre-line break-words">
            {empreendimento.informacoes}
          </div>
          <div className="flex flex-wrap items-center text-xs text-gray-500 mt-2 sm:mt-3">
            <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
            <span>Criado em {new Date(empreendimento.criadoEm).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
