
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
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Demo data
const demoStampTypes = [
  { id: '1', name: 'Sublimação' },
  { id: '2', name: 'DTF' },
  { id: '3', name: 'Silk' },
];

const demoProducts = [
  { id: '1', name: 'Camiseta Básica', stampTypeId: '1', imageUrl: null },
  { id: '2', name: 'Moletom Canguru', stampTypeId: '2', imageUrl: null },
  { id: '3', name: 'Vestido Midi', stampTypeId: '3', imageUrl: null },
];

const Products = () => {
  const [products, setProducts] = useState(demoProducts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({ id: '', name: '', stampTypeId: '', imageUrl: null });
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setCurrentProduct((prev) => ({ ...prev, stampTypeId: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // In a real app, this would upload to Google Drive and get a URL
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      setCurrentProduct((prev) => ({ ...prev, imageUrl }));
    }
  };

  const resetForm = () => {
    setCurrentProduct({ id: '', name: '', stampTypeId: '', imageUrl: null });
    setIsEditing(false);
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: typeof currentProduct) => {
    setCurrentProduct(product);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing) {
        // Update existing product
        setProducts((prev) =>
          prev.map((product) =>
            product.id === currentProduct.id ? currentProduct : product
          )
        );
        toast({
          title: 'Produto atualizado',
          description: `${currentProduct.name} foi atualizado com sucesso.`
        });
      } else {
        // Add new product
        const newProduct = {
          ...currentProduct,
          id: Date.now().toString(),
        };
        setProducts((prev) => [...prev, newProduct]);
        toast({
          title: 'Produto adicionado',
          description: `${newProduct.name} foi adicionado com sucesso.`
        });
      }
      
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao salvar o produto.',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = (id: string) => {
    try {
      const productToDelete = products.find(p => p.id === id);
      setProducts((prev) => prev.filter((product) => product.id !== id));
      toast({
        title: 'Produto removido',
        description: `${productToDelete?.name} foi removido com sucesso.`
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao remover o produto.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog} className="flex items-center">
              <Plus className="mr-2 h-4 w-4" /> Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Editar Produto' : 'Adicionar Produto'}</DialogTitle>
              <DialogDescription>
                {isEditing 
                  ? 'Edite as informações do produto abaixo.' 
                  : 'Preencha as informações para adicionar um novo produto.'}
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
                    value={currentProduct.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="stampType" className="text-right">
                    Tipo de Estampa
                  </Label>
                  <Select 
                    value={currentProduct.stampTypeId} 
                    onValueChange={handleSelectChange}
                    required
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione o tipo de estampa" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {demoStampTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="image" className="text-right">
                    Imagem
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="col-span-3"
                    />
                    {currentProduct.imageUrl && (
                      <div className="mt-2">
                        <img
                          src={currentProduct.imageUrl}
                          alt="Preview"
                          className="h-20 w-auto object-contain rounded-md"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">
                  {isEditing ? 'Salvar Alterações' : 'Adicionar Produto'}
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
                <TableHead>Tipo de Estampa</TableHead>
                <TableHead>Imagem</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Nenhum produto cadastrado.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      {demoStampTypes.find((t) => t.id === product.stampTypeId)?.name || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-10 w-10 object-cover rounded-md"
                        />
                      ) : (
                        <span className="text-muted-foreground">Sem imagem</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(product)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
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

export default Products;
