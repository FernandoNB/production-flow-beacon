
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Demo data
const demoStampTypes = [
  { id: '1', name: 'Sublimação' },
  { id: '2', name: 'DTF' },
  { id: '3', name: 'Silk' },
];

const StampTypes = () => {
  const [stampTypes, setStampTypes] = useState(demoStampTypes);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentStampType, setCurrentStampType] = useState({ id: '', name: '' });
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentStampType((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setCurrentStampType({ id: '', name: '' });
    setIsEditing(false);
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (stampType: typeof currentStampType) => {
    setCurrentStampType(stampType);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing) {
        // Update existing stamp type
        setStampTypes((prev) =>
          prev.map((type) =>
            type.id === currentStampType.id ? currentStampType : type
          )
        );
        toast({
          title: 'Tipo de estampa atualizado',
          description: `${currentStampType.name} foi atualizado com sucesso.`
        });
      } else {
        // Add new stamp type
        const newStampType = {
          ...currentStampType,
          id: Date.now().toString(),
        };
        setStampTypes((prev) => [...prev, newStampType]);
        toast({
          title: 'Tipo de estampa adicionado',
          description: `${newStampType.name} foi adicionado com sucesso.`
        });
      }
      
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving stamp type:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao salvar o tipo de estampa.',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = (id: string) => {
    try {
      const typeToDelete = stampTypes.find(t => t.id === id);
      setStampTypes((prev) => prev.filter((type) => type.id !== id));
      toast({
        title: 'Tipo de estampa removido',
        description: `${typeToDelete?.name} foi removido com sucesso.`
      });
    } catch (error) {
      console.error('Error deleting stamp type:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao remover o tipo de estampa.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tipos de Estampa</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog} className="flex items-center">
              <Plus className="mr-2 h-4 w-4" /> Novo Tipo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Editar Tipo de Estampa' : 'Adicionar Tipo de Estampa'}</DialogTitle>
              <DialogDescription>
                {isEditing 
                  ? 'Edite as informações do tipo de estampa abaixo.' 
                  : 'Preencha as informações para adicionar um novo tipo de estampa.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Nome
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={currentStampType.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">
                  {isEditing ? 'Salvar Alterações' : 'Adicionar Tipo'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stampTypes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="h-24 text-center">
                    Nenhum tipo de estampa cadastrado.
                  </TableCell>
                </TableRow>
              ) : (
                stampTypes.map((type) => (
                  <TableRow key={type.id}>
                    <TableCell className="font-medium">{type.name}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(type)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(type.id)}
                          className="text-red-600 hover:text-red-900 hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Excluir</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default StampTypes;
