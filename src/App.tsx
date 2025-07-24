import React, { useState, useEffect } from 'react';
import { Building2, Users, FileText, Settings, Eye, Package, Home, User, LogOut } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginPage } from './components/LoginPage';
import { ProfileModal } from './components/ProfileModal';
import { EmpreendimentosPage } from './pages/EmpreendimentosPage';
import { UsuariosPage } from './pages/UsuariosPage';
import { ContatosPage } from './pages/ContatosPage';
import { ManutencoesPage } from './pages/ManutencoesPage';
import { VisitasPage } from './pages/VisitasPage';
import { AtribuirProdutosPage } from './pages/AtribuirProdutosPage';
import { EmpreendimentosViewPage } from './pages/EmpreendimentosViewPage';
import { useEmpreendimentos } from './hooks/useEmpreendimentos';
import { useUsuarios } from './hooks/useUsuarios';
import { useVisitas } from './hooks/useVisitas';
import { useManutencoes } from './hooks/useManutencoes';
import { useAtribuicoes } from './hooks/useAtribuicoes';
import { VisitaModal } from './components/VisitaModal';
import { ManutencaoModal } from './components/ManutencaoModal';
import { Edit, Trash2 } from 'lucide-react';

type PageType = 'dashboard' | 'empreendimentos' | 'empreendimentos-view' | 'usuarios' | 'contatos' | 'manutencoes' | 'visitas' | 'atribuir-produtos';

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageType>(
    user?.cargo === 'Gerente de Produto' ? 'dashboard' : 'dashboard'
  );

  // Atualizar página quando usuário mudar
  React.useEffect(() => {
    if (user?.cargo === 'Gerente de Produto') {
      setCurrentPage('dashboard');
    }
  }, [user]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage onPageChange={setCurrentPage} />;
      case 'empreendimentos':
        return <EmpreendimentosPage />;
      case 'empreendimentos-view':
        return <EmpreendimentosViewPage onBack={() => setCurrentPage('dashboard')} onEmpreendimentoClick={() => setCurrentPage('empreendimentos')} />;
      case 'usuarios':
        return <UsuariosPage />;
      case 'contatos':
        return <ContatosPage />;
      case 'manutencoes':
        return <ManutencoesPage />;
      case 'visitas':
        return <VisitasPage />;
      case 'atribuir-produtos':
        return <AtribuirProdutosPage />;
      default:
        return <EmpreendimentosPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader currentPage={currentPage} onPageChange={setCurrentPage} />
      {renderPage()}
    </div>
  );
}

function AdminHeader({ currentPage, onPageChange }: { 
  currentPage: PageType; 
  onPageChange: (page: PageType) => void 
}) {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };

  const getInitials = (nome: string) => {
    return nome.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getAvatarColor = (nome: string) => {
    const colors = [
      'bg-green-500',
      'bg-blue-500', 
      'bg-purple-500',
      'bg-orange-500',
      'bg-pink-500',
      'bg-indigo-500'
    ];
    const index = nome.length % colors.length;
    return colors[index];
  };
  
  // Filtrar itens de navegação baseado no cargo do usuário
  const allNavigationItems = [
    { key: 'dashboard', label: 'Dashboard', icon: Home },
    { key: 'empreendimentos', label: 'Empreendimentos', icon: Building2 },
    { key: 'usuarios', label: 'Usuários', icon: Users },
    { key: 'contatos', label: 'Contatos', icon: FileText },
    { key: 'manutencoes', label: 'Manutenções', icon: Package },
    { key: 'visitas', label: 'Visitas', icon: Eye },
    { key: 'atribuir-produtos', label: 'Atribuir Produtos', icon: Settings }
  ];

  const navigationItems = allNavigationItems.filter(item => {
    // Se for gerente, remover usuários e atribuir produtos
    if (user?.cargo === 'Gerente de Produto') {
      return !['usuarios', 'atribuir-produtos'].includes(item.key);
    }
    // Admin vê tudo
    return true;
  });
  
  return (
    <>
      <header className="gradient-primary text-white shadow-strong sticky top-0 z-50 backdrop-blur-sm">
        <div className="container-fluid">
          <div className="flex items-center justify-between h-18">
            {/* Logo */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center p-2 ring-2 ring-white/20">
                <img 
                  src="/OLC.jpeg" 
                  alt="Construtora Planeta Logo" 
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg lg:text-xl xl:text-2xl font-bold text-white tracking-tight whitespace-nowrap">Construtora Planeta</h1>
                <p className="text-xs lg:text-sm text-white/80 font-medium mt-0.5">Gestão de Produtos</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg font-bold text-white tracking-tight">Planeta</h1>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => onPageChange(item.key as PageType)}
                    className={`flex items-center space-x-2 lg:space-x-3 px-3 lg:px-4 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm backdrop-blur-sm ${
                      currentPage === item.key 
                        ? 'bg-white/20 text-white shadow-medium ring-1 ring-white/30' 
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden lg:inline">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* User Menu - Desktop */}
            <div className="hidden md:block relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-2 rounded-xl hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
              >
                {user?.foto ? (
                  <img 
                    src={user.foto} 
                    alt={user.nome}
                    className="w-9 h-9 rounded-xl object-cover ring-2 ring-white/30 shadow-medium"
                    onError={(e) => {
                      // Se a imagem falhar, mostrar iniciais
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = `<div class="flex items-center justify-center w-9 h-9 ${getAvatarColor(user?.nome || '')} rounded-xl text-white font-bold text-sm ring-2 ring-white/30 shadow-medium">${getInitials(user?.nome || '')}</div>`;
                      }
                    }}
                  />
                ) : (
                  <div className={`flex items-center justify-center w-9 h-9 rounded-xl text-white font-bold text-sm ring-2 ring-white/30 shadow-medium ${getAvatarColor(user?.nome || '')}`}>
                    {getInitials(user?.nome || '')}
                  </div>
                )}
                <span className="hidden lg:block text-sm font-medium text-white">{user?.nome}</span>
                <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-3 w-52 bg-white/95 backdrop-blur-md rounded-2xl shadow-strong py-2 z-50 ring-1 ring-gray-200/50 animate-fade-in">
                  <button
                    onClick={() => {
                      setIsProfileOpen(true);
                      setShowUserMenu(false);
                    }}
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 w-full text-left transition-colors font-medium"
                  >
                    <User className="w-5 h-5 mr-3 text-green-600" />
                    Meu Perfil
                  </button>
                  <hr className="my-1 border-gray-200" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors font-medium"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/50 animate-slide-up">
              <div className="px-4 pt-4 pb-3 space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.key}
                      onClick={() => {
                        onPageChange(item.key as PageType);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-left font-medium transition-all duration-200 ${
                        currentPage === item.key 
                          ? 'bg-green-100 text-green-700 shadow-medium' 
                          : 'text-gray-700 hover:text-green-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
                
                {/* Mobile User Menu */}
                <div className="border-t border-gray-200/50 pt-4 mt-4">
                  <div className="flex items-center px-4 mb-4">
                    {user?.foto ? (
                      <img 
                        src={user.foto} 
                        alt={user.nome}
                        className="w-12 h-12 rounded-xl object-cover ring-2 ring-green-200 shadow-medium"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            const div = document.createElement('div');
                            div.className = `flex items-center justify-center w-12 h-12 ${getAvatarColor(user?.nome || '')} rounded-xl text-white font-bold text-lg ring-2 ring-green-200 shadow-medium`;
                            div.textContent = getInitials(user?.nome || '');
                            parent.insertBefore(div, e.currentTarget);
                          }
                        }}
                      />
                    ) : (
                      <div className={`flex items-center justify-center w-12 h-12 ${getAvatarColor(user?.nome || '')} rounded-xl text-white font-bold text-lg ring-2 ring-green-200 shadow-medium`}>
                        {getInitials(user?.nome || '')}
                      </div>
                    )}
                    <div className="ml-4 flex-1">
                      <p className="text-lg font-semibold text-gray-900">{user?.nome}</p>
                      <p className="text-sm text-gray-600 font-medium">{user?.cargo}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 px-4">
                    <button
                      onClick={() => {
                        setIsProfileOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-left text-gray-700 hover:text-green-700 hover:bg-gray-50 transition-all duration-200 font-medium"
                    >
                      <User className="w-5 h-5" />
                      <span>Meu Perfil</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-left text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 font-medium"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sair</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
}

function DashboardPage({ onPageChange }: { onPageChange: (page: PageType) => void }) {
  const { user } = useAuth();
  const { empreendimentos } = useEmpreendimentos();
  const { usuarios } = useUsuarios();
  const { visitas, estatisticas: estatisticasVisitas } = useVisitas();
  const { estatisticas: estatisticasManutencoes } = useManutencoes();

  // Filtrar funcionalidades baseado no cargo do usuário
  const isAdmin = user?.cargo === 'Administrador';
  const isGerente = user?.cargo === 'Gerente de Produto';

  // Se for gerente, mostrar dashboard específico
  if (isGerente) {
    return <ManagerDashboard onPageChange={onPageChange} />;
  }

  const gerentesAtivos = usuarios.filter(u => u.cargo === 'Gerente de Produto').length;
  const visitasDaSemana = visitas.filter(v => {
    const hoje = new Date();
    const inicioSemana = new Date(hoje.setDate(hoje.getDate() - hoje.getDay()));
    const fimSemana = new Date(hoje.setDate(hoje.getDate() - hoje.getDay() + 6));
    const dataVisita = new Date(v.data);
    return dataVisita >= inicioSemana && dataVisita <= fimSemana;
  }).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-medium">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                  Dashboard
                </h1>
                <p className="text-lg text-gray-600 font-medium">
                  Bem-vindo, <span className="text-green-600 font-semibold">{user?.nome}</span>!
                </p>
              </div>
            </div>
          </div>
          
          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-medium p-6 border-l-4 border-l-green-500 hover:shadow-strong transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Visitas da Semana</p>
                  <p className="text-3xl font-bold text-gray-900">{visitasDaSemana}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-medium group-hover:scale-110 transition-transform duration-300">
                  <Eye className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-medium p-6 border-l-4 border-l-orange-500 hover:shadow-strong transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Total de Visitas</p>
                  <p className="text-3xl font-bold text-gray-900">{estatisticasVisitas.total}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-medium group-hover:scale-110 transition-transform duration-300">
                  <Eye className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-medium p-6 border-l-4 border-l-blue-500 hover:shadow-strong transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Empreendimentos</p>
                  <p className="text-3xl font-bold text-gray-900">{empreendimentos.length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-medium group-hover:scale-110 transition-transform duration-300">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            
            {isAdmin && (
              <div className="bg-white rounded-2xl shadow-medium p-6 border-l-4 border-l-purple-500 hover:shadow-strong transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Gerentes Ativos</p>
                    <p className="text-3xl font-bold text-gray-900">{gerentesAtivos}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-medium group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Seção Empreendimentos */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 mb-8 text-white shadow-strong">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-3">Empreendimentos</h2>
                <p className="text-green-100 text-lg">
                  {isAdmin ? 'Gerencie todos os projetos da construtora' : 'Visualize os empreendimentos disponíveis'}
                </p>
              </div>
              <button 
                onClick={() => onPageChange('empreendimentos-view')}
                className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/20 transition-all duration-200 flex items-center space-x-3 font-semibold border border-white/20 hover:border-white/30 shadow-medium"
              >
                <Building2 className="w-5 h-5" />
                <span>Ver Empreendimentos</span>
              </button>
            </div>
          </div>
          
          {/* Grid de Funcionalidades */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isAdmin && (
              <div 
                className="bg-white rounded-2xl shadow-medium p-6 hover:shadow-strong transition-all duration-300 cursor-pointer group border border-gray-100 hover:border-blue-200"
                onClick={() => onPageChange('usuarios')}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-medium group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Gerenciar Usuários</h3>
                    <p className="text-sm text-gray-600 font-medium">Criar e editar contas de gerentes</p>
                  </div>
                </div>
              </div>
            )}
            
            {isAdmin && (
              <div 
                className="bg-white rounded-2xl shadow-medium p-6 hover:shadow-strong transition-all duration-300 cursor-pointer group border border-gray-100 hover:border-green-200"
                onClick={() => onPageChange('empreendimentos')}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-medium group-hover:scale-110 transition-transform duration-300">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors">Empreendimentos</h3>
                    <p className="text-sm text-gray-600 font-medium">Cadastrar e gerenciar projetos</p>
                  </div>
                </div>
              </div>
            )}
            
            <div 
              className="bg-white rounded-2xl shadow-medium p-6 hover:shadow-strong transition-all duration-300 cursor-pointer group border border-gray-100 hover:border-purple-200"
              onClick={() => onPageChange('visitas')}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-medium group-hover:scale-110 transition-transform duration-300">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors">Visitas</h3>
                  <p className="text-sm text-gray-600 font-medium">
                    {isAdmin ? 'Acompanhar visitas agendadas' : 'Agendar e acompanhar suas visitas'}
                  </p>
                </div>
              </div>
            </div>
            
            <div 
              className="bg-white rounded-2xl shadow-medium p-6 hover:shadow-strong transition-all duration-300 cursor-pointer group border border-gray-100 hover:border-orange-200"
              onClick={() => onPageChange('manutencoes')}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-medium group-hover:scale-110 transition-transform duration-300">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors">Manutenções</h3>
                  <p className="text-sm text-gray-600 font-medium">
                    {isAdmin ? 'Acompanhar solicitações dos gerentes' : 'Solicitar manutenções'}
                  </p>
                </div>
              </div>
            </div>
            
            <div 
              className="bg-white rounded-2xl shadow-medium p-6 hover:shadow-strong transition-all duration-300 cursor-pointer group border border-gray-100 hover:border-cyan-200"
              onClick={() => onPageChange('contatos')}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-medium group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-cyan-600 transition-colors">Contatos</h3>
                  <p className="text-sm text-gray-600 font-medium">Gerenciar prestadores de serviço</p>
                </div>
              </div>
            </div>
            
            {isAdmin && (
              <div 
                className="bg-white rounded-2xl shadow-medium p-6 hover:shadow-strong transition-all duration-300 cursor-pointer group border border-gray-100 hover:border-indigo-200"
                onClick={() => onPageChange('atribuir-produtos')}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-medium group-hover:scale-110 transition-transform duration-300">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">Atribuir Produtos</h3>
                    <p className="text-sm text-gray-600 font-medium">Gerenciar acesso de gerentes aos produtos</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function ManagerDashboard({ onPageChange }: { onPageChange: (page: PageType) => void }) {
  const { user } = useAuth();
  const { visitas, criarVisita, carregarVisitas } = useVisitas();
  const { manutencoes, criarManutencao, concluirManutencao, carregarManutencoes } = useManutencoes();
  const { atribuicoes, loading: loadingAtribuicoes } = useAtribuicoes();
  const [isVisitaModalOpen, setIsVisitaModalOpen] = useState(false);
  const [isManutencaoModalOpen, setIsManutencaoModalOpen] = useState(false);
  const [selectedEmpreendimento, setSelectedEmpreendimento] = useState('');

  // Recarregar dados quando componente montar
  useEffect(() => {
    carregarVisitas();
    carregarManutencoes();
  }, []);

  // Filtrar dados do gerente logado
  const minhasAtribuicoes = loadingAtribuicoes ? null : atribuicoes.find(a => a.gerenteId === user?.id);
  const meusEmpreendimentos = minhasAtribuicoes?.empreendimentos || [];
  const minhasVisitas = visitas.filter(v => 
    meusEmpreendimentos.some(emp => emp.nome === v.empreendimento)
  );
  const minhasManutencoes = manutencoes.filter(m => 
    meusEmpreendimentos.some(emp => emp.nome === m.empreendimento)
  );

  // Visitas agendadas da semana
  const visitasAgendadasSemana = minhasVisitas.filter(v => {
    if (v.status !== 'agendada') return false;
    
    const hoje = new Date();
    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(hoje.getDate() - hoje.getDay());
    inicioSemana.setHours(0, 0, 0, 0);
    
    const fimSemana = new Date(inicioSemana);
    fimSemana.setDate(inicioSemana.getDate() + 6);
    fimSemana.setHours(23, 59, 59, 999);
    
    const dataVisita = new Date(v.data);
    return dataVisita >= inicioSemana && dataVisita <= fimSemana;
  });
  
  const solicitacoesPendentes = minhasManutencoes.filter(m => m.status === 'pendente');
  const melhoriasConcluidas = minhasManutencoes.filter(m => m.status === 'concluida');

  const handleCriarManutencao = (empreendimento: string) => {
    setSelectedEmpreendimento(empreendimento);
    setIsManutencaoModalOpen(true);
  };

  const handleAgendarVisita = (empreendimento: string) => {
    setSelectedEmpreendimento(empreendimento);
    setIsVisitaModalOpen(true);
  };

  const handleSubmitVisita = (dados: any) => {
    criarVisita(dados);
    alert('Visita agendada com sucesso!');
    // Recarregar dados
    setTimeout(() => {
      carregarVisitas();
    }, 100);
  };

  const handleSubmitManutencao = (dados: any) => {
    criarManutencao({
      ...dados,
      gerente: user?.nome || ''
    });
    alert('Solicitação de manutenção criada com sucesso!');
    // Recarregar dados
    setTimeout(() => {
      carregarManutencoes();
    }, 100);
  };

  const handleConcluirManutencao = (id: string) => {
    if (window.confirm('Marcar esta manutenção como concluída?')) {
      concluirManutencao(id);
      // Recarregar dados
      setTimeout(() => {
        carregarManutencoes();
      }, 100);
    }
  };

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

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta':
        return 'bg-red-100 text-red-800';
      case 'media':
        return 'bg-yellow-100 text-yellow-800';
      case 'baixa':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (loadingAtribuicoes) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header do Gerente */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-medium">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Dashboard do Gerente</h1>
                <p className="text-lg text-gray-600 font-medium">
                  Bem-vindo, <span className="text-green-600 font-semibold">{user?.nome}</span>!
                </p>
              </div>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-medium p-6 border-l-4 border-l-green-500 hover:shadow-strong transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Produtos Ativos</p>
                  <p className="text-3xl font-bold text-gray-900">{meusEmpreendimentos.length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-medium group-hover:scale-110 transition-transform duration-300">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-medium p-6 border-l-4 border-l-blue-500 hover:shadow-strong transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Visitas da Semana</p>
                  <p className="text-3xl font-bold text-gray-900">{visitasAgendadasSemana.length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-medium group-hover:scale-110 transition-transform duration-300">
                  <Eye className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-medium p-6 border-l-4 border-l-orange-500 hover:shadow-strong transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Solicitações Pendentes</p>
                  <p className="text-3xl font-bold text-gray-900">{solicitacoesPendentes.length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-medium group-hover:scale-110 transition-transform duration-300">
                  <Package className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-medium p-6 border-l-4 border-l-purple-500 hover:shadow-strong transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Melhorias Concluídas</p>
                  <p className="text-3xl font-bold text-gray-900">{melhoriasConcluidas.length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-medium group-hover:scale-110 transition-transform duration-300">
                  <Settings className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Seção Produtos Ativos */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 mb-8 text-white shadow-strong">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-3">Meus Produtos</h2>
                <p className="text-green-100 text-lg">
                  Gerencie seus {meusEmpreendimentos.length} produtos ativos
                </p>
              </div>
              <button 
                onClick={() => onPageChange('empreendimentos-view')}
                className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/20 transition-all duration-200 flex items-center space-x-3 font-semibold border border-white/20 hover:border-white/30 shadow-medium"
              >
                <Building2 className="w-5 h-5" />
                <span>Ver Produtos</span>
              </button>
            </div>
          </div>
          
          {/* Grid de Seções - Visão Geral */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visitas Agendadas */}
            <div className="bg-white rounded-2xl shadow-medium p-6 hover:shadow-strong transition-all duration-300 border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-medium">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Visitas Agendadas</h3>
                  <p className="text-sm text-gray-600 font-medium">Próximas visitas programadas</p>
                </div>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                {minhasVisitas.filter(v => v.status === 'agendada').slice(0, 3).map((visita) => (
                  <div key={visita.id} className="border-l-4 border-l-blue-500 pl-3 sm:pl-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm sm:text-base font-medium text-gray-900 truncate">{visita.corretor}</h4>
                        <p className="text-xs sm:text-sm text-blue-600 mb-1 truncate">{visita.empreendimento}</p>
                      </div>
                      <div className="flex space-x-1 sm:space-x-2 ml-2">
                        <button className="text-blue-600 hover:text-blue-700 p-1">
                          <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-700 p-1">
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(visita.data).toLocaleDateString('pt-BR')} às {visita.horario}
                    </p>
                  </div>
                ))}
                {minhasVisitas.filter(v => v.status === 'agendada').length === 0 && (
                  <p className="text-gray-500 text-sm">Nenhuma visita agendada</p>
                )}
              </div>
            </div>

            {/* Solicitações */}
            <div className="bg-white rounded-2xl shadow-medium p-6 hover:shadow-strong transition-all duration-300 border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-medium">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Solicitações Pendentes</h3>
                  <p className="text-sm text-gray-600 font-medium">Melhorias necessárias</p>
                </div>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                {solicitacoesPendentes.slice(0, 3).map((manutencao) => (
                  <div key={manutencao.id} className="border-l-4 border-l-orange-500 pl-3 sm:pl-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm sm:text-base font-medium text-gray-900 truncate">{manutencao.empreendimento}</h4>
                        <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">{manutencao.descricao}</p>
                      </div>
                      <div className="flex space-x-1 sm:space-x-2 ml-2">
                        <button className="text-blue-600 hover:text-blue-700 p-1">
                          <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-700 p-1">
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPrioridadeColor(manutencao.prioridade)}`}>
                        {manutencao.prioridade}
                      </span>
                      <button
                        onClick={() => handleConcluirManutencao(manutencao.id)}
                        className="bg-green-600 text-white px-2 sm:px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors"
                      >
                        Concluir
                      </button>
                    </div>
                  </div>
                ))}
                {solicitacoesPendentes.length === 0 && (
                  <p className="text-gray-500 text-sm">Nenhuma solicitação pendente</p>
                )}
              </div>
            </div>

            {/* Melhorias Concluídas */}
            <div className="bg-white rounded-2xl shadow-medium p-6 hover:shadow-strong transition-all duration-300 border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-medium">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Melhorias Concluídas</h3>
                  <p className="text-sm text-gray-600 font-medium">Histórico de melhorias</p>
                </div>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                {melhoriasConcluidas.slice(0, 3).map((manutencao) => (
                  <div key={manutencao.id} className="border-l-4 border-l-green-500 pl-3 sm:pl-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm sm:text-base font-medium text-gray-900 truncate">{manutencao.empreendimento}</h4>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1 line-clamp-2">{manutencao.descricao}</p>
                      </div>
                      <button className="text-red-600 hover:text-red-700 p-1 ml-2">
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Concluída
                      </span>
                      {manutencao.concluidoEm && (
                        <span className="text-xs text-gray-500">
                          {new Date(manutencao.concluidoEm).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {melhoriasConcluidas.length === 0 && (
                  <p className="text-gray-500 text-sm">Nenhuma melhoria concluída</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <VisitaModal
          isOpen={isVisitaModalOpen}
          onClose={() => setIsVisitaModalOpen(false)}
          onSubmit={handleSubmitVisita}
          empreendimento={selectedEmpreendimento}
        />

        <ManutencaoModal
          isOpen={isManutencaoModalOpen}
          onClose={() => setIsManutencaoModalOpen(false)}
          onSubmit={handleSubmitManutencao}
          empreendimentos={meusEmpreendimentos.map(e => e.nome)}
          empreendimento={selectedEmpreendimento}
        />
      </main>
    </div>
  );
}

export default App;
