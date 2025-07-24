import React, { useState } from 'react';
import { Edit2, Save, X, Plus, Trash2, User, Building, Mail } from 'lucide-react';
import { AtribuicaoEmpreendimento, Empreendimento } from '../types';

interface AtribuicaoCardProps {
  atribuicao: AtribuicaoEmpreendimento;
  onEdit: (atribuicao: AtribuicaoEmpreendimento) => void;
  onSave: (gerenteId: string, empreendimentoIds: string[]) => void;
  empreendimentosDisponiveis: Empreendimento[];
}

export function AtribuicaoCard({ atribuicao, onEdit, onSave, empreendimentosDisponiveis }: AtribuicaoCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [empreendimentosSelecionados, setEmpreendimentosSelecionados] = useState<string[]>(
    atribuicao.empreendimentos.map(e => e.id)
  );
  const [novoEmpreendimento, setNovoEmpreendimento] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Estoque':
        return 'bg-blue-100 text-blue-800';
      case 'STAND':
        return 'bg-yellow-10 min-w-[2.5rem]0 text-yellow-800';
      case 'PDV':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (nome: string) => {
    return nome.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEmpreendimentosSelecionados(atribuicao.empreendimentos.map(e => e.id));
  };

  const handleSave = () => {
    onSave(atribuicao.gerenteId, empreendimentosSelecionados);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEmpreendimentosSelecionados(atribuicao.empreendimentos.map(e => e.id));
    setNovoEmpreendimento('');
  };

  const removeEmpreendimento = (empId: string) => {
    setEmpreendimentosSelecionados(prev => prev.filter(id => id !== empId));
  };

  const addEmpreendimento = () => {
    if (novoEmpreendimento && !empreendimentosSelecionados.includes(novoEmpreendimento)) {
      setEmpreendimentosSelecionados(prev => [...prev, novoEmpreendimento]);
      setNovoEmpreendimento('');
    }
  };

  const empreendimentosAtribuidos = empreendimentosDisponiveis.filter(emp => 
    empreendimentosSelecionados.includes(emp.id)
  );

  const empreendimentosNaoAtribuidos = empreendimentosDisponiveis.filter(emp => 
    !empreendimentosSelecionados.includes(emp.id)
  );

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
      {/* Header do Card */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">
                {getInitials(atribuicao.gerenteNome)}
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <div className="flex items-center mb-1">
              <User className="w-4 h-4 text-gray-400 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">{atribuicao.gerenteNome}</h3>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Mail className="w-4 h-4 mr-2" />
              <span>{atribuicao.gerenteEmail}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="inline-flex items-center px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </button>
              <button
                onClick={handleCancel}
                className="inline-flex items-center px-4 py-2 text-sm font-medium bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-lg transition-all duration-200"
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              className="inline-flex items-center px-4 py-2 text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg transition-all duration-200"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Editar
            </button>
          )}
        </div>
      </div>

      {/* Seção de Empreendimentos */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Building className="w-5 h-5 text-gray-500 mr-2" />
            <h4 className="text-lg font-semibold text-gray-900">
              Empreendimentos
            </h4>
          </div>
          <div className="px-3 py-1 bg-gray-100 rounded-full">
            <span className="text-sm font-medium text-gray-600">
              {empreendimentosAtribuidos.length} {empreendimentosAtribuidos.length === 1 ? 'item' : 'itens'}
            </span>
          </div>
        </div>
        
        {empreendimentosAtribuidos.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
            <Building className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">Nenhum empreendimento atribuído</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 mb-4">
            {empreendimentosAtribuidos.map((emp) => (
              <div key={emp.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <span className="font-semibold text-gray-900">{emp.nome}</span>
                    <div className="text-sm text-gray-500">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(emp.status)}`}>
                        {emp.status}
                      </span>
                    </div>
                  </div>
                </div>
                {isEditing && (
                  <button
                    onClick={() => removeEmpreendimento(emp.id)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remover empreendimento"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {isEditing && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="bg-blue-50 rounded-xl p-4 mb-4">
              <h5 className="text-sm font-semibold text-blue-900 mb-3">Adicionar Empreendimento</h5>
              <div className="flex items-center space-x-3">
                <select
                  value={novoEmpreendimento}
                  onChange={(e) => setNovoEmpreendimento(e.target.value)}
                  className="flex-1 px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="">Selecione um empreendimento</option>
                  {empreendimentosNaoAtribuidos.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.nome} - {emp.status}
                    </option>
                  ))}
                </select>
                <button
                  onClick={addEmpreendimento}
                  disabled={!novoEmpreendimento}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                  title="Adicionar empreendimento"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {empreendimentosNaoAtribuidos.length > 0 && (
              <div className="mt-3">
                <div className="text-xs text-gray-500 mb-2">Empreendimentos disponíveis:</div>
                <div className="flex flex-wrap gap-1">
                  {empreendimentosNaoAtribuidos.slice(0, 3).map(emp => (
                    <button
                      key={emp.id}
                      onClick={() => setNovoEmpreendimento(emp.id)}
                      className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 transition-colors"
                    >
                      {emp.nome}
                    </button>
                  ))}
                  {empreendimentosNaoAtribuidos.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{empreendimentosNaoAtribuidos.length - 3} mais
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
