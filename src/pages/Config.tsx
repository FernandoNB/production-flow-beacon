
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Config() {
  const [sheetsConfig, setSheetsConfig] = useState({
    apiKey: localStorage.getItem('sheets_api_key') || '',
    spreadsheetId: localStorage.getItem('sheets_spreadsheet_id') || '',
  });

  const [driveConfig, setDriveConfig] = useState({
    apiKey: localStorage.getItem('drive_api_key') || '',
    folderId: localStorage.getItem('drive_folder_id') || '',
  });

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

  return (
    <div className="container mx-auto py-6 space-y-8">
      <h1 className="text-2xl font-bold">Configurações</h1>
      
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

      <Card>
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
    </div>
  );
}
