
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { User, UploadCloud } from "lucide-react";

export default function Config() {
  const { user, updateUserProfile } = useAuth();
  const [sheetsConfig, setSheetsConfig] = useState({
    apiKey: localStorage.getItem('sheets_api_key') || 'AIzaSyBYJvozgf4-uFo56So2zgGjPC0UyforW9U',
    spreadsheetId: localStorage.getItem('sheets_spreadsheet_id') || '19ba5K3P1qjckTsdql0QFJjqTDZQtGwmakayUizkYpfY',
  });

  const [driveConfig, setDriveConfig] = useState({
    apiKey: localStorage.getItem('drive_api_key') || '',
    folderId: localStorage.getItem('drive_folder_id') || '',
  });

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user?.picture || null);

  const saveGoogleSheetsConfig = () => {
    if (!sheetsConfig.apiKey || !sheetsConfig.spreadsheetId) {
      toast.error("Por favor, preencha todos os campos do Google Sheets");
      return;
    }

    localStorage.setItem('sheets_api_key', sheetsConfig.apiKey);
    localStorage.setItem('sheets_spreadsheet_id', sheetsConfig.spreadsheetId);
    toast.success("Configuração do Google Sheets salva com sucesso!");
  };

  const saveGoogleDriveConfig = () => {
    if (!driveConfig.apiKey || !driveConfig.folderId) {
      toast.error("Por favor, preencha todos os campos do Google Drive");
      return;
    }

    localStorage.setItem('drive_api_key', driveConfig.apiKey);
    localStorage.setItem('drive_folder_id', driveConfig.folderId);
    toast.success("Configuração do Google Drive salva com sucesso!");
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicture(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfileChanges = () => {
    try {
      // Implement password validation if needed
      if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
        toast.error("As senhas não coincidem");
        return;
      }

      // Update profile information using the AuthContext
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
      
      <Tabs defaultValue="profile">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Perfil do Usuário</TabsTrigger>
          <TabsTrigger value="google-sheets">Google Sheets</TabsTrigger>
          <TabsTrigger value="google-drive">Google Drive</TabsTrigger>
        </TabsList>

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

        <TabsContent value="google-sheets">
          <Card>
            <CardHeader>
              <CardTitle>Google Sheets (Base de Dados)</CardTitle>
              <CardDescription>
                Configure a conexão com o Google Sheets para usar como banco de dados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sheets-api-key">API Key</Label>
                <Input 
                  id="sheets-api-key"
                  value={sheetsConfig.apiKey}
                  onChange={(e) => setSheetsConfig({...sheetsConfig, apiKey: e.target.value})}
                  placeholder="Insira sua API Key do Google Sheets"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="spreadsheet-id">ID da Planilha</Label>
                <Input 
                  id="spreadsheet-id"
                  value={sheetsConfig.spreadsheetId}
                  onChange={(e) => setSheetsConfig({...sheetsConfig, spreadsheetId: e.target.value})}
                  placeholder="Insira o ID da planilha (encontrado na URL)"
                />
                <p className="text-sm text-muted-foreground">
                  Exemplo: https://docs.google.com/spreadsheets/d/<span className="font-medium">ID_DA_PLANILHA</span>/edit
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveGoogleSheetsConfig}>Salvar Configuração</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="google-drive">
          <Card>
            <CardHeader>
              <CardTitle>Google Drive (Armazenamento de Imagens)</CardTitle>
              <CardDescription>
                Configure a conexão com o Google Drive para armazenamento de imagens
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="drive-api-key">API Key</Label>
                <Input 
                  id="drive-api-key"
                  value={driveConfig.apiKey}
                  onChange={(e) => setDriveConfig({...driveConfig, apiKey: e.target.value})}
                  placeholder="Insira sua API Key do Google Drive"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="folder-id">ID da Pasta</Label>
                <Input 
                  id="folder-id"
                  value={driveConfig.folderId}
                  onChange={(e) => setDriveConfig({...driveConfig, folderId: e.target.value})}
                  placeholder="Insira o ID da pasta para armazenar imagens"
                />
                <p className="text-sm text-muted-foreground">
                  Exemplo: https://drive.google.com/drive/folders/<span className="font-medium">ID_DA_PASTA</span>
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveGoogleDriveConfig}>Salvar Configuração</Button>
            </CardFooter>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Instruções</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <h3 className="font-medium">Como obter credenciais do Google:</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Acesse o <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google Cloud Console</a></li>
                <li>Crie um novo projeto ou selecione um existente</li>
                <li>Vá para a seção "API e Serviços" &gt; "Credenciais"</li>
                <li>Clique em "Criar Credenciais" e selecione "Chave de API"</li>
                <li>Ative as APIs do Google Sheets e Google Drive para o seu projeto</li>
                <li>Compartilhe suas planilhas e pastas do Drive com a conta de serviço gerada</li>
              </ol>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
