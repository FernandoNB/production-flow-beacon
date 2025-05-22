
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { TrendingUp, Layers, AlertTriangle, Users, Package, Calendar, ClipboardList } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo de volta, {user?.name || 'Usuário'}!
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Produção Total do Mês
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,245</div>
            <p className="text-xs text-muted-foreground">
              +20% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taxa de Falhas
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.5%</div>
            <p className="text-xs text-muted-foreground">
              -0.7% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Produtividade (por costureira)
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-muted-foreground">
              peças/dia em média
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Ordens de Produção Ativas</CardTitle>
            <CardDescription>
              Ordens em andamento e próximas de vencimento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">#OP-2023-0123</p>
                  <p className="text-sm text-muted-foreground">Camiseta Sublimação</p>
                </div>
                <div className="flex items-center">
                  <span className="inline-flex h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>
                  <span className="text-sm">Vence em 2 dias</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">#OP-2023-0124</p>
                  <p className="text-sm text-muted-foreground">Moletom DTF</p>
                </div>
                <div className="flex items-center">
                  <span className="inline-flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                  <span className="text-sm">Vence em 5 dias</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pb-2">
                <div>
                  <p className="font-medium">#OP-2023-0125</p>
                  <p className="text-sm text-muted-foreground">Vestido Silk</p>
                </div>
                <div className="flex items-center">
                  <span className="inline-flex h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                  <span className="text-sm">Atrasado 1 dia</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>
              Últimas atualizações no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="mr-3 rounded-full bg-primary/20 p-2">
                  <Package className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Novo produto adicionado</p>
                  <p className="text-xs text-muted-foreground">Há 2 horas</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-3 rounded-full bg-primary/20 p-2">
                  <ClipboardList className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Ordem de produção concluída</p>
                  <p className="text-xs text-muted-foreground">Hoje, 9:30</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-3 rounded-full bg-primary/20 p-2">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Lançamento de costuras</p>
                  <p className="text-xs text-muted-foreground">Ontem, 16:45</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
