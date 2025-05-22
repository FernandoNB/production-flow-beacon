
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { fetchSheetData, appendToSheet, SHEETS, isSheetsConfigured } from "@/services/googleServices";
import { useNavigate } from "react-router-dom";

// Define schema for our form
const formSchema = z.object({
  name: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres",
  }),
});

export default function StampTypes() {
  const [stampTypes, setStampTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Create form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  // Load data on component mount
  useEffect(() => {
    if (!isSheetsConfigured()) {
      toast.error(
        "Google Sheets não está configurado. Redirecionando para a página de configuração.", 
        { duration: 5000 }
      );
      navigate("/configuracao");
      return;
    }
    
    loadStampTypes();
  }, [navigate]);

  const loadStampTypes = async () => {
    try {
      setLoading(true);
      const data = await fetchSheetData(SHEETS.STAMP_TYPES);
      setStampTypes(data);
    } catch (error) {
      toast.error("Erro ao carregar tipos de estampa: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Form submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await appendToSheet(SHEETS.STAMP_TYPES, [values.name]);
      toast.success("Tipo de estampa adicionado com sucesso!");
      form.reset();
      loadStampTypes(); // Reload data
    } catch (error) {
      toast.error("Erro ao adicionar tipo de estampa: " + (error as Error).message);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tipos de Estampa</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button>Adicionar Tipo</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Adicionar Tipo de Estampa</SheetTitle>
              <SheetDescription>
                Adicione um novo tipo de estampa ao sistema.
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
                  <Button type="submit">Salvar</Button>
                </form>
              </Form>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stampTypes.length > 0 ? (
            stampTypes.map((type, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{type.Nome || type.name || "Sem nome"}</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Additional details could go here */}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-6">
              <p className="text-gray-500">Nenhum tipo de estampa cadastrado.</p>
              <Button variant="outline" className="mt-2" onClick={loadStampTypes}>
                Recarregar Dados
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
