
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { fetchSheetData, appendToSheet, SHEETS } from "@/services/googleServices";
import { toast } from "sonner";
import { FailureType } from "@/types";
import { Edit, Trash2, Plus } from "lucide-react";

export default function FailureTypes() {
  const [failureTypes, setFailureTypes] = useState<FailureType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newFailureType, setNewFailureType] = useState<{
    name: string;
    category: "estampa" | "costura" | "defeito";
  }>({
    name: "",
    category: "estampa",
  });

  // Load data from Google Sheets
  const loadFailureTypes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchSheetData(SHEETS.FAILURE_TYPES);
      const formattedData = data.map((item: any, index: number) => ({
        id: item.ID || `failure-type-${index}`,
        name: item.Nome || "",
        category: item.Categoria || "estampa",
      }));
      setFailureTypes(formattedData);
    } catch (err) {
      console.error("Error loading failure types:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao carregar tipos de falha. Verifique sua conexão e configurações do Google Sheets."
      );
      toast.error(
        "Erro ao carregar tipos de falha. Verifique sua conexão e configurações."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFailureTypes();
  }, []);

  const handleAddFailureType = async () => {
    if (!newFailureType.name) {
      toast.error("Por favor, informe o nome do tipo de falha.");
      return;
    }

    setIsLoading(true);
    try {
      const newId = `ft-${Date.now()}`;
      await appendToSheet(SHEETS.FAILURE_TYPES, [
        newId,
        newFailureType.name,
        newFailureType.category,
      ]);

      // Update local state
      setFailureTypes([
        ...failureTypes,
        {
          id: newId,
          name: newFailureType.name,
          category: newFailureType.category,
        },
      ]);

      toast.success("Tipo de falha adicionado com sucesso!");
      setNewFailureType({ name: "", category: "estampa" });
      setDialogOpen(false);
    } catch (err) {
      console.error("Error adding failure type:", err);
      toast.error(
        "Erro ao adicionar tipo de falha. Verifique sua conexão e configurações."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "estampa":
        return "Estampa";
      case "costura":
        return "Costura";
      case "defeito":
        return "Defeito";
      default:
        return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "estampa":
        return "bg-blue-100 text-blue-800";
      case "costura":
        return "bg-green-100 text-green-800";
      case "defeito":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tipos de Falha</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Adicionar Tipo de Falha
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Tipo de Falha</DialogTitle>
              <DialogDescription>
                Preencha os campos abaixo para adicionar um novo tipo de falha.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  placeholder="Ex: Falha na costura"
                  value={newFailureType.name}
                  onChange={(e) =>
                    setNewFailureType({
                      ...newFailureType,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select
                  value={newFailureType.category}
                  onValueChange={(value: "estampa" | "costura" | "defeito") =>
                    setNewFailureType({
                      ...newFailureType,
                      category: value,
                    })
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="estampa">Estampa</SelectItem>
                    <SelectItem value="costura">Costura</SelectItem>
                    <SelectItem value="defeito">Defeito</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button onClick={handleAddFailureType} disabled={isLoading}>
                {isLoading ? "Processando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Card className="border-red-300 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-700">{error}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Lista de Tipos de Falha</CardTitle>
          <CardDescription>
            Gerencie os tipos de falha que podem ocorrer na produção
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-primary rounded-full"></div>
            </div>
          ) : failureTypes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nenhum tipo de falha cadastrado.</p>
              <p className="text-sm mt-2">
                Clique em "Adicionar Tipo de Falha" para começar.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="w-28">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {failureTypes.map((failureType) => (
                  <TableRow key={failureType.id}>
                    <TableCell>{failureType.name}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                          failureType.category
                        )}`}
                      >
                        {getCategoryLabel(failureType.category)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="icon" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
