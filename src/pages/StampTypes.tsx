
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Edit, Trash2, Plus } from "lucide-react";

// Define the StampType interface based on our database structure
interface StampType {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

// Define schema for our form
const formSchema = z.object({
  name: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres",
  }),
  description: z.string().optional(),
});

export default function StampTypes() {
  const [stampTypes, setStampTypes] = useState<StampType[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStampType, setEditingStampType] = useState<StampType | null>(null);

  // Create form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Load data on component mount
  useEffect(() => {
    loadStampTypes();
  }, []);

  const loadStampTypes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('stamp_types')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setStampTypes(data || []);
    } catch (error) {
      console.error("Erro ao carregar tipos de estampa:", error);
      toast.error("Erro ao carregar tipos de estampa: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Form submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      
      if (editingStampType) {
        // Update existing stamp type
        const { error } = await supabase
          .from('stamp_types')
          .update({
            name: values.name,
            description: values.description || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingStampType.id);

        if (error) throw error;
        toast.success("Tipo de estampa atualizado com sucesso!");
      } else {
        // Create new stamp type
        const { error } = await supabase
          .from('stamp_types')
          .insert([{
            name: values.name,
            description: values.description || null,
          }]);

        if (error) throw error;
        toast.success("Tipo de estampa adicionado com sucesso!");
      }

      form.reset();
      setEditingStampType(null);
      setDialogOpen(false);
      loadStampTypes();
    } catch (error) {
      console.error("Erro ao salvar tipo de estampa:", error);
      toast.error("Erro ao salvar tipo de estampa: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (stampType: StampType) => {
    setEditingStampType(stampType);
    form.setValue('name', stampType.name);
    form.setValue('description', stampType.description || '');
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este tipo de estampa?")) {
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('stamp_types')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success("Tipo de estampa excluído com sucesso!");
      loadStampTypes();
    } catch (error) {
      console.error("Erro ao excluir tipo de estampa:", error);
      toast.error("Erro ao excluir tipo de estampa: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingStampType(null);
    form.reset();
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Tipos de Estampa</h1>
          <p className="text-muted-foreground">
            Gerencie os tipos de estampa utilizados na produção
          </p>
        </div>
        <Sheet open={dialogOpen} onOpenChange={handleDialogClose}>
          <SheetTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Tipo
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>
                {editingStampType ? "Editar Tipo de Estampa" : "Adicionar Tipo de Estampa"}
              </SheetTitle>
              <SheetDescription>
                {editingStampType 
                  ? "Edite as informações do tipo de estampa."
                  : "Adicione um novo tipo de estampa ao sistema."
                }
              </SheetDescription>
            </SheetHeader>
            <div className="py-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Sublimação" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição (Opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Processo de impressão por transferência de calor" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Salvando..." : (editingStampType ? "Atualizar" : "Salvar")}
                  </Button>
                </form>
              </Form>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Tipos de Estampa</CardTitle>
          <CardDescription>
            Todos os tipos de estampa cadastrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : stampTypes.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="w-28">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stampTypes.map((stampType) => (
                  <TableRow key={stampType.id}>
                    <TableCell className="font-medium">{stampType.name}</TableCell>
                    <TableCell>{stampType.description || "-"}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          size="icon" 
                          variant="outline"
                          onClick={() => handleEdit(stampType)}
                          disabled={loading}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="destructive"
                          onClick={() => handleDelete(stampType.id)}
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhum tipo de estampa cadastrado.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Clique em "Adicionar Tipo" para começar.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
