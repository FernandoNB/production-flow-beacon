
import React from "react";  // Add explicit React import
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AppLayout } from "./components/layout/AppLayout";
import { GoogleOAuthProvider } from '@react-oauth/google';

import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Products from "./pages/Products";
import StampTypes from "./pages/StampTypes";
import FailureTypes from "./pages/FailureTypes";
import Employees from "./pages/Employees";
import PrintEntries from "./pages/PrintEntries";
import FailureEntries from "./pages/FailureEntries";
import SewingEntries from "./pages/SewingEntries";
import Sales from "./pages/Sales";
import Shipping from "./pages/Shipping";
import ProductionOrders from "./pages/ProductionOrders";
import Productivity from "./pages/Productivity";
import Config from "./pages/Config";

// Create QueryClient instance outside of the component
const queryClient = new QueryClient();

// Google OAuth client ID - replace with your actual client ID
const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID";

const App = () => (
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<AppLayout><Index /></AppLayout>} />
                <Route path="/produtos" element={<AppLayout><Products /></AppLayout>} />
                <Route path="/tipos-estampa" element={<AppLayout><StampTypes /></AppLayout>} />
                <Route path="/tipos-falha" element={<AppLayout><FailureTypes /></AppLayout>} />
                <Route path="/funcionarios" element={<AppLayout><Employees /></AppLayout>} />
                <Route path="/impressoes" element={<AppLayout><PrintEntries /></AppLayout>} />
                <Route path="/falhas" element={<AppLayout><FailureEntries /></AppLayout>} />
                <Route path="/costuras" element={<AppLayout><SewingEntries /></AppLayout>} />
                <Route path="/vendas" element={<AppLayout><Sales /></AppLayout>} />
                <Route path="/envios" element={<AppLayout><Shipping /></AppLayout>} />
                <Route path="/ordens-producao" element={<AppLayout><ProductionOrders /></AppLayout>} />
                <Route path="/produtividade" element={<AppLayout><Productivity /></AppLayout>} />
                <Route path="/configuracao" element={<AppLayout><Config /></AppLayout>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

export default App;
