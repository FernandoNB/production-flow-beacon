
import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const Login = () => {
  const { isAuthenticated, googleLogin } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSuccess = (credentialResponse: any) => {
    googleLogin(credentialResponse);
    toast({
      title: 'Login realizado com sucesso',
      description: 'Bem-vindo ao Sistema PCP',
    });
  };

  const handleError = () => {
    toast({
      title: 'Erro ao realizar login',
      description: 'Tente novamente mais tarde',
      variant: 'destructive',
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pcp-800 to-pcp-600 p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-pcp-800">Sistema PCP</h1>
          <p className="mt-2 text-gray-600">Planejamento e Controle de Produção</p>
        </div>
        
        <div className="mt-8">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col items-center justify-center w-full p-4 bg-gray-50 rounded-md">
              <p className="mb-4 text-sm text-center text-gray-600">
                Faça login com sua conta Google para acessar o sistema
              </p>
              
              <div className="w-full flex justify-center">
                <GoogleLogin
                  onSuccess={handleSuccess}
                  onError={handleError}
                  useOneTap
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2025 Sistema PCP. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
