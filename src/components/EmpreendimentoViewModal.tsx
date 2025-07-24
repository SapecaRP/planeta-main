import React from 'react';
import { X, MapPin, Calendar, Info, ExternalLink } from 'lucide-react';
import { Empreendimento } from '../types';

interface EmpreendimentoViewModalProps {
  empreendimento: Empreendimento | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EmpreendimentoViewModal({ empreendimento, isOpen, onClose }: EmpreendimentoViewModalProps) {
  if (!isOpen || !empreendimento) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Estoque':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'STAND':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'PDV':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const openGoogleMaps = () => {
    const encodedAddress = encodeURIComponent(empreendimento.endereco);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(googleMapsUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative">
          {empreendimento.foto && (
            <div className="h-64 overflow-hidden rounded-t-xl">
              <img 
                src={empreendimento.foto} 
                alt={empreendimento.nome}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 transition-all duration-200 shadow-lg"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title and Status */}
          <div className="flex flex-wrap items-start justify-between mb-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {empreendimento.nome}
              </h2>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(empreendimento.status)}`}>
                {empreendimento.status}
              </span>
            </div>
          </div>

          {/* Address */}
          <div className="mb-6">
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <MapPin className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900 mb-1">Endereço</h3>
                <p className="text-gray-700">{empreendimento.endereco}</p>
              </div>
              <button
                onClick={openGoogleMaps}
                className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                title="Abrir no Google Maps"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Maps</span>
              </button>
            </div>
          </div>

          {/* Information */}
          <div className="mb-6">
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <Info className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Informações</h3>
                <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {empreendimento.informacoes}
                </div>
              </div>
            </div>
          </div>

          {/* Created Date */}
          <div className="flex items-center space-x-2 text-sm text-gray-500 pt-4 border-t">
            <Calendar className="w-4 h-4" />
            <span>Criado em {new Date(empreendimento.criadoEm).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}