import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Contato, ContatoFormData } from '../types';

interface ContatoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dados: ContatoFormData) => void;
  contato?: Contato;
}

export function ContatoModal({ isOpen, onClose, onSubmit, contato }: ContatoModalProps) {
  const [formData, setFormData] = useState<ContatoFormData>({
    nome: '',
    telefone: '',
    tipoServico: 'Manutenção'
  });

  const [outroTipoServico, setOutroTipoServico] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (contato) {
      setFormData({
        nome: contato.nome,
        telefone: contato.telefone,
        tipoServico: contato.tipoServico
      });
      // Se o tipo de serviço não está nas opções padrão, assume que é "Outros"
      const tiposServicoPadrao = ['Manutenção', 'Limpeza', 'Elétrica', 'Hidráulica', 'Pintura', 'Jardinagem', 'Segurança', 'Facilities'];
      if (!tiposServicoPadrao.includes(contato.tipoServico)) {
        setOutroTipoServico(contato.tipoServico);
        setFormData(prev => ({ ...prev, tipoServico: 'Outros' }));
      }
    } else {
      setFormData({
        nome: '',
        telefone: '',
        tipoServico: 'Manutenção'
      });
      setOutroTipoServico('');
    }
    setErrors({});
  }, [contato, isOpen]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome/Empresa é obrigatório';
    }

    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    }

    if (!formData.tipoServico) {
      newErrors.tipoServico = 'Tipo de serviço é obrigatório';
    }

    if (formData.tipoServico === 'Outros' && !outroTipoServico.trim()) {
      newErrors.outroTipoServico = 'Especifique o tipo de serviço';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const dadosParaEnviar = {
      ...formData,
      tipoServico: formData.tipoServico === 'Outros' ? outroTipoServico : formData.tipoServico
    };

    onSubmit(dadosParaEnviar as ContatoFormData);
    onClose();
  };

  const formatTelefone = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara baseada no tamanho
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 2)} ${numbers.slice(2)}`;
    } else if (numbers.length <= 11) {
      return `${numbers.slice(0, 2)} ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    } else {
      // Limita a 11 dígitos (DDD + 9 dígitos)
      return `${numbers.slice(0, 2)} ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'telefone') {
      const formattedValue = formatTelefone(value);
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Limpar campo "Outros" quando mudar para outro tipo de serviço
    if (name === 'tipoServico' && value !== 'Outros') {
      setOutroTipoServico('');
    }
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleOutroTipoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOutroTipoServico(e.target.value);
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors.outroTipoServico) {
      setErrors(prev => ({ ...prev, outroTipoServico: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-wrap items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex flex-wrap items-center justify-between p-6 border-b">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Criar Novo Contato
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="nome" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Nome/Empresa
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                errors.nome ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Nome do contato ou empresa"
            />
            {errors.nome && <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.nome}</p>}
          </div>

          <div>
            <label htmlFor="telefone" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Telefone
            </label>
            <input
              type="tel"
              id="telefone"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                errors.telefone ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="15 99196-9581"
            />
            {errors.telefone && <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.telefone}</p>}
          </div>

          <div>
            <label htmlFor="tipoServico" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Tipo de Serviço
            </label>
            <select
              id="tipoServico"
              name="tipoServico"
              value={formData.tipoServico}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                errors.tipoServico ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Selecione o tipo de serviço</option>
              <option value="Manutenção">Manutenção</option>
              <option value="Limpeza">Limpeza</option>
              <option value="Elétrica">Elétrica</option>
              <option value="Hidráulica">Hidráulica</option>
              <option value="Pintura">Pintura</option>
              <option value="Jardinagem">Jardinagem</option>
              <option value="Segurança">Segurança</option>
              <option value="Facilities">Facilities</option>
              <option value="Outros">Outros</option>
            </select>
            {errors.tipoServico && <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.tipoServico}</p>}
          </div>

          {formData.tipoServico === 'Outros' && (
            <div>
              <label htmlFor="outroTipoServico" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Especifique o tipo de serviço
              </label>
              <input
                type="text"
                id="outroTipoServico"
                value={outroTipoServico}
                onChange={handleOutroTipoChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.outroTipoServico ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Digite o tipo de serviço"
              />
              {errors.outroTipoServico && <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.outroTipoServico}</p>}
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 sm:px-6 lg:px-8 rounded-md hover:bg-green-700 transition-colors font-medium"
            >
              Criar Contato
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
