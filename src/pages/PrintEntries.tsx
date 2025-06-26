
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from '@/lib/supabase-client';
import { format } from "date-fns";
import { Calendar as CalendarIcon, Printer } from "lucide-react";
import { cn } from "@/lib/utils";
import { StampType, Employee, PrintEntry } from '@/types';

const formSchema = z.object({
  date: z.date({
    required_error: "Selecione uma data",
  }),
  stamp_type_id: z.string().min(1, "Selecione um tipo de estampa"),
  quantity: z.number().min(1, "A quantidade deve ser maior que 0"),
  employee_id: z.string().optional(),
});

const PrintEntries = () => {
  const [printEntries, setPrintEntries] = useState<PrintEntry[]>([]);
  const [stampTypes, setStampTypes] = useState<StampType[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPrints, setTotalPrints] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      quantity: 1,
    },
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Carregar impressões
      const { data: printsData, error: printsError } = await supabase
        .from('print_entries')
        .select('*')
        .order('date', { ascending: false });

      if (printsError) throw printsError;
      setPrintEntries(printsData || []);

      // Calcular total de impressões
      const total = (printsData || []).reduce((sum, entry) => sum + entry.quantity, 0);
      setTotalPrints(total);

      // Carregar tipos de estampa
      const { data: stampData, error: stampError } = await supabase
        .from('stamp_types')
        .select('*')
        .order('name');

      if (stampError) throw stampError;
      setStampTypes(stampData || []);

      // Carregar funcionários
      const { data: employeesData, error: employeesError } = await supabase
        .from('employees')
        .select('*')
        .order('name');

      if (employeesError) throw employeesError;
      setEmployees(employeesData || []);

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error("Erro ao carregar dados: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { error } = await supabase
        .from('print_entries')
        .insert([{
          date: format(values.date, 'yyyy-MM-dd'),
          stamp_type_id: values.stamp_type_id,
          quantity: values.quantity,
          employee_id: values.employee_id || null,
        }]);

      if (error) throw error;

      toast.success("Impressão registrada com sucesso!");
      form.reset();
      loadData();
    } catch (error) {
      console.error('Erro ao registrar impressão:', error);
      toast.error("Erro ao registrar impressão: " + (error as Error).message);
    }
  };

  const getStampTypeName = (stampTypeId: string) => {
    const stampType = stampTypes.find(st => st.id === stampTypeId);
    return stampType?.name || 'Tipo não encontrado';
  };

  const getEmployeeName = (employeeId: string | null) => {
    if (!employeeId) return '-';
    const employee = employees.find(emp => emp.id === employeeId);
    return employee?.name || 'Funcionário não encontrado';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Impressões</h1>
        <p className="text-muted-foreground">
          Registre as impressões diárias por tipo de estampa.
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Impressões</CardTitle>
            <Printer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPrints}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registros Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {printEntries.filter(entry => entry.date === format(new Date(), 'yyyy-MM-dd')).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tipos de Estampa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stampTypes.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Botão para adicionar nova impressão */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Registros de Impressão</h2>
        <Sheet>
          <SheetTrigger asChild>
            <Button>
              <Printer className="mr-2 h-4 w-4" />
              Registrar Impressão
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Registrar Nova Impressão</SheetTitle>
              <SheetDescription>
                Adicione um novo registro de impressão diária.
              </SheetDescription>
            </SheetHeader>
            <div className="py-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Data</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "dd/MM/yyyy")
                                ) : (
                                  <span>Selecione uma data</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stamp_type_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Estampa</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo de estampa" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {stampTypes.map((stampType) => (
                              <SelectItem key={stampType.id} value={stampType.id}>
                                {stampType.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantidade</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            placeholder="Ex: 100"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="employee_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Funcionário (Opcional)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um funcionário" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {employees.map((employee) => (
                              <SelectItem key={employee.id} value={employee.id}>
                                {employee.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    Registrar Impressão
                  </Button>
                </form>
              </Form>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Tabela de impressões */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Impressões</CardTitle>
          <CardDescription>
            Lista de todas as impressões registradas no sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : printEntries.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo de Estampa</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Funcionário</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {printEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      {format(new Date(entry.date), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell>{getStampTypeName(entry.stamp_type_id)}</TableCell>
                    <TableCell className="font-medium">{entry.quantity}</TableCell>
                    <TableCell>{getEmployeeName(entry.employee_id)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhuma impressão registrada ainda.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Use o botão "Registrar Impressão" para adicionar o primeiro registro.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PrintEntries;
