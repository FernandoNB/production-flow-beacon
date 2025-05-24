
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { User, UploadCloud, Database, CheckCircle } from "lucide-react";

export default function Config() {
  const { user, updateUserProfile } = useAuth();
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user?.picture || null);

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicture(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfileChanges = () => {
    try {
      if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
        toast.error("As senhas não coincidem");
        return;
      }

      const profileUpdate: any = {
        name: profileData.name,
      };
      
      if (previewUrl) {
        profileUpdate.picture = previewUrl;
      }

      if (updateUserProfile) {
        updateUserProfile(profileUpdate);
        toast.success("Perfil atualizado com sucesso");
      } else {
        toast.error("Erro ao atualizar perfil: função não disponível");
      }
    } catch (error) {
      toast.error("Erro ao atualizar perfil");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <h1 className="text-2xl font-bold">Configurações</h1>
      
      <Tabs defaultValue="supabase">
        <TabsList className="mb-4">
          <TabsTrigger value="supabase">Supabase</TabsTrigger>
          <TabsTrigger value="profile">Perfil do Usuário</TabsTrigger>
        </TabsList>

        <TabsContent value="supabase">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Configuração do Supabase
              </CardTitle>
              <CardDescription>
                Sistema configurado para usar Supabase como banco de dados e autenticação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <p className="font-medium text-green-800">Supabase Conectado</p>
                  <p className="text-sm text-green-700">
                    O sistema está configurado e conectado ao Supabase automaticamente.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Project ID</Label>
                    <div className="p-3 bg-gray-50 rounded-md border">
                      <code className="text-sm">yuemklmnxshsvruhlafe</code>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Status</Label>
                    <div className="p-3 bg-gray-50 rounded-md border">
                      <span className="text-sm text-green-600">✓ Conectado</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">URL do Projeto</Label>
                  <div className="p-3 bg-gray-50 rounded-md border">
                    <code className="text-sm">https://yuemklmnxshsvruhlafe.supabase.co</code>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Funcionalidades Ativas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Base de Dados PostgreSQL</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Autenticação de Usuários</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Row Level Security (RLS)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Real-time Updates</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                O Supabase está configurado automaticamente e não requer configuração manual adicional.
                Todas as funcionalidades do sistema (autenticação, base de dados, etc.) funcionam através desta integração.
              </p>
              <div className="pt-2">
                <h4 className="font-medium text-sm mb-2">Recursos Disponíveis:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Gestão de tipos de falha</li>
                  <li>• Gestão de produtos e funcionários</li>
                  <li>• Registos de produção (impressão, costura, falhas)</li>
                  <li>• Gestão de vendas e envios</li>
                  <li>• Controlo de ordens de produção</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Perfil</CardTitle>
                <CardDescription>
                  Atualize suas informações pessoais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center justify-center mb-4">
                  <Avatar className="h-24 w-24 mb-4">
                    {previewUrl ? (
                      <AvatarImage src={previewUrl} alt={user?.name} />
                    ) : (
                      <AvatarFallback className="text-2xl">
                        {user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex items-center">
                    <label
                      htmlFor="profile-picture"
                      className="flex items-center gap-2 text-sm cursor-pointer text-blue-600 hover:text-blue-800"
                    >
                      <UploadCloud size={16} />
                      Alterar foto
                    </label>
                    <input
                      id="profile-picture"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfilePictureChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="display-name">Nome</Label>
                  <Input
                    id="display-name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={profileData.email}
                    readOnly
                    disabled
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alterar Senha</CardTitle>
                <CardDescription>
                  Atualize sua senha de acesso ao sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Senha Atual</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={profileData.currentPassword}
                    onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nova Senha</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={profileData.newPassword}
                    onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirme a Nova Senha</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={profileData.confirmPassword}
                    onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveProfileChanges}>Salvar Alterações</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
