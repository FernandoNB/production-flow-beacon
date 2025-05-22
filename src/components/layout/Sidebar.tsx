
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Folder, 
  Tag, 
  AlertTriangle, 
  Users, 
  Calendar, 
  ClipboardList, 
  TrendingUp,
  Menu,
  X,
  Package,
  BoxSelect,
  ShoppingBag
} from 'lucide-react';

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, isActive, onClick }) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
        "hover:bg-sidebar-accent",
        isActive ? "bg-sidebar-accent text-primary-foreground" : "text-sidebar-foreground"
      )}
      onClick={onClick}
    >
      <Icon size={20} />
      <span>{label}</span>
    </Link>
  );
};

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleSidebar = () => setIsOpen(!isOpen);
  
  return (
    <>
      {/* Mobile sidebar toggle button */}
      <button 
        className="fixed z-50 p-2 text-white bg-primary rounded-md top-4 left-4 md:hidden"
        onClick={toggleSidebar}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      
      {/* Sidebar */}
      <aside className={cn(
        "bg-sidebar fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-200 ease-in-out",
        "flex flex-col border-r border-sidebar-border",
        "md:relative md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-center h-16 border-b border-sidebar-border">
          <Link to="/" className="text-xl font-bold text-white">
            Sistema PCP
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <div className="mb-4">
            <h3 className="px-3 mb-2 text-xs font-semibold text-sidebar-foreground/70 uppercase">
              Cadastros
            </h3>
            <div className="space-y-1">
              <NavItem 
                to="/produtos" 
                icon={Package} 
                label="Produtos" 
                isActive={location.pathname.startsWith('/produtos')} 
                onClick={() => setIsOpen(false)}
              />
              <NavItem 
                to="/tipos-estampa" 
                icon={Tag} 
                label="Tipos de Estampa" 
                isActive={location.pathname.startsWith('/tipos-estampa')} 
                onClick={() => setIsOpen(false)}
              />
              <NavItem 
                to="/tipos-falha" 
                icon={AlertTriangle} 
                label="Tipos de Falha" 
                isActive={location.pathname.startsWith('/tipos-falha')} 
                onClick={() => setIsOpen(false)}
              />
              <NavItem 
                to="/funcionarios" 
                icon={Users} 
                label="Funcionários" 
                isActive={location.pathname.startsWith('/funcionarios')} 
                onClick={() => setIsOpen(false)}
              />
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="px-3 mb-2 text-xs font-semibold text-sidebar-foreground/70 uppercase">
              Lançamentos
            </h3>
            <div className="space-y-1">
              <NavItem 
                to="/impressoes" 
                icon={Calendar} 
                label="Impressões" 
                isActive={location.pathname.startsWith('/impressoes')} 
                onClick={() => setIsOpen(false)}
              />
              <NavItem 
                to="/falhas" 
                icon={AlertTriangle} 
                label="Falhas" 
                isActive={location.pathname.startsWith('/falhas')} 
                onClick={() => setIsOpen(false)}
              />
              <NavItem 
                to="/costuras" 
                icon={BoxSelect} 
                label="Costuras" 
                isActive={location.pathname.startsWith('/costuras')} 
                onClick={() => setIsOpen(false)}
              />
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="px-3 mb-2 text-xs font-semibold text-sidebar-foreground/70 uppercase">
              Operações
            </h3>
            <div className="space-y-1">
              <NavItem 
                to="/vendas" 
                icon={ShoppingBag} 
                label="Vendas" 
                isActive={location.pathname.startsWith('/vendas')} 
                onClick={() => setIsOpen(false)}
              />
              <NavItem 
                to="/envios" 
                icon={Folder} 
                label="Envios" 
                isActive={location.pathname.startsWith('/envios')} 
                onClick={() => setIsOpen(false)}
              />
              <NavItem 
                to="/ordens-producao" 
                icon={ClipboardList} 
                label="Ordens de Produção" 
                isActive={location.pathname.startsWith('/ordens-producao')} 
                onClick={() => setIsOpen(false)}
              />
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="px-3 mb-2 text-xs font-semibold text-sidebar-foreground/70 uppercase">
              Relatórios
            </h3>
            <div className="space-y-1">
              <NavItem 
                to="/produtividade" 
                icon={TrendingUp} 
                label="Produtividade" 
                isActive={location.pathname.startsWith('/produtividade')} 
                onClick={() => setIsOpen(false)}
              />
            </div>
          </div>
        </nav>
      </aside>
      
      {/* Overlay to close sidebar on mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 md:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
