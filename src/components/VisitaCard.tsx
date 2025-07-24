import React from 'react';
import { Calendar, Clock, User, MapPin, Edit, Trash2 } from 'lucide-react';
import { Visita } from '../types';

interface VisitaCardProps {
  visita: Visita;
  onEdit?: (visita: Visita) => void;
  onDelete?: (id: string) => void;
  onMarkAsCompleted?: (id: string) => void;
  isAdmin?: boolean;
}

export function VisitaCard({ visita, onEdit, onDelete, onMarkAsCompleted, isAdmin = false }: VisitaCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendada':
        return 'text-blue-600';
      case 'realizada':
        return 'text-green-600';
      case 'cancelada':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'agendada':
        return 'agendada';
      case 'realizada':
        return 'realizada';
      case 'cancelada':
        return 'cancelada';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="card-elevated group hover:shadow-strong transition-all duration-300 border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${
            visita.status === 'realizada' 
              ? 'bg-green-500'
              : visita.status === 'cancelada'
              ? 'bg-red-500'
              : 'bg-blue-500'
          }`}></div>
          <span className={`px-3 py-1.5 rounded-xl text-sm font-semibold ${
            visita.status === 'realizada' 
              ? 'bg-green-100 text-green-700'
              : visita.status === 'cancelada'
              ? 'bg-red-100 text-red-700'
              : 'bg-blue-100 text-blue-700'
          }`}>
            {visita.status === 'realizada' ? 'Realizada' : visita.status === 'cancelada' ? 'Cancelada' : 'Agendada'}
          </span>
        </div>
        <div className="flex space-x-2">
          {!isAdmin && onEdit && (
            <button
              onClick={() => onEdit(visita)}
              className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all duration-200"
              title="Editar"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          {!isAdmin && onDelete && (
            <button
              onClick={() => onDelete(visita.id)}
              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200"
              title="Excluir"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Corretor</p>
            <p className="text-base font-bold text-gray-900">{visita.corretor}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
            <MapPin className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Empreendimento</p>
            <p className="text-base font-bold text-gray-900">{visita.empreendimento}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Data</p>
              <p className="text-base font-bold text-gray-900">
                {new Date(visita.data).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center">
              <Clock className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Horário</p>
              <p className="text-base font-bold text-gray-900">{visita.horario}</p>
            </div>
          </div>
        </div>
      </div>

      {visita.status === 'agendada' && !isAdmin && onMarkAsCompleted && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={() => onMarkAsCompleted(visita.id)}
            className="btn-primary w-full flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Marcar como Realizada</span>
          </button>
        </div>
      )}
    </div>
  );
}
