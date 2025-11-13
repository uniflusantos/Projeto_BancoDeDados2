"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProduct, updateProduct } from "@/lib/api";
import type { Product, ProductUpdate } from "@/lib/types";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import { Card } from "@/components/retroui/Card";
import { Button } from "@/components/retroui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/retroui/Textarea";
import { UploadButton } from "@/lib/uploadthing";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState<{
    nome: string;
    preco: number;
    marca: string;
    desc: string;
    image_url: string | null;
  }>({
    nome: "",
    preco: 0,
    marca: "",
    desc: "",
    image_url: null,
  });
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();

  const isOwner = user && product && user.id === product.owner_id;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProduct(productId);
        setProduct(data);
        // Initialize edit form with product data
        setEditFormData({
          nome: data.nome,
          preco: data.preco,
          marca: data.marca,
          desc: data.desc || "",
          image_url: data.image_url,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Falha ao carregar produto"
        );
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  useEffect(() => {
    // Reset edit form when product changes
    if (product) {
      setEditFormData({
        nome: product.nome,
        preco: product.preco,
        marca: product.marca,
        desc: product.desc || "",
        image_url: product.image_url,
      });
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (product) {
      addToCart(product, quantity);
      router.push("/cart");
    }
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: name === "preco" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleEditSave = async () => {
    if (!product) return;

    // Validation
    if (!editFormData.nome.trim()) {
      setSaveError("Nome do produto é obrigatório");
      return;
    }
    if (!editFormData.marca.trim()) {
      setSaveError("Marca é obrigatória");
      return;
    }
    if (editFormData.preco <= 0) {
      setSaveError("Preço deve ser maior que 0");
      return;
    }

    setSaveError("");
    setSaveSuccess(false);
    setSaveLoading(true);

    try {
      const updateData: ProductUpdate = {
        nome: editFormData.nome,
        preco: editFormData.preco,
        marca: editFormData.marca,
        desc: editFormData.desc || null,
        image_url: editFormData.image_url,
      };

      const updatedProduct = await updateProduct(
        product.product_id,
        updateData
      );
      setProduct(updatedProduct);
      setSaveSuccess(true);
      setIsEditMode(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Falha ao atualizar produto"
      );
    } finally {
      setSaveLoading(false);
    }
  };

  const handleEditCancel = () => {
    if (product) {
      setEditFormData({
        nome: product.nome,
        preco: product.preco,
        marca: product.marca,
        desc: product.desc || "",
        image_url: product.image_url,
      });
    }
    setIsEditMode(false);
    setSaveError("");
    setSaveSuccess(false);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Loading />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                {error || "Produto não encontrado"}
              </AlertDescription>
            </Alert>
            <Button variant="outline" onClick={() => router.push("/")}>
              Voltar aos produtos
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="mb-6"
          >
            ← Voltar aos produtos
          </Button>
          <Card className="w-full">
            <Card.Content className="p-8">
              {isEditMode ? (
                <>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-foreground mb-4">
                      Editar Produto
                    </h2>
                    {saveError && (
                      <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{saveError}</AlertDescription>
                      </Alert>
                    )}
                    {saveSuccess && (
                      <Alert className="mb-4">
                        <AlertDescription>
                          Produto atualizado com sucesso!
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-nome">Nome do Produto *</Label>
                      <Input
                        id="edit-nome"
                        name="nome"
                        type="text"
                        required
                        value={editFormData.nome}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-marca">Marca *</Label>
                      <Input
                        id="edit-marca"
                        name="marca"
                        type="text"
                        required
                        value={editFormData.marca}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-preco">Preço *</Label>
                      <Input
                        id="edit-preco"
                        name="preco"
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        value={editFormData.preco}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-desc">Descrição</Label>
                      <Textarea
                        id="edit-desc"
                        name="desc"
                        rows={4}
                        value={editFormData.desc}
                        onChange={handleEditChange}
                      />
                    </div>

                    <div className="space-y-2 overflow-visible">
                      <Label>Imagem</Label>
                      {editFormData.image_url ? (
                        <div className="space-y-2">
                          <div className="relative w-full border border-input rounded-md overflow-hidden">
                            <img
                              src={editFormData.image_url}
                              alt="Pré-visualização do produto"
                              className="w-full h-auto max-h-64 object-contain"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setEditFormData((prev) => ({
                                ...prev,
                                image_url: null,
                              }));
                            }}
                          >
                            Alterar Imagem
                          </Button>
                        </div>
                      ) : (
                        <div
                          className="overflow-visible"
                          style={{
                            paddingTop: "0.75rem",
                            paddingBottom: "1rem",
                            minHeight: "fit-content",
                          }}
                        >
                          <UploadButton
                            endpoint="imageUploader"
                            onClientUploadComplete={(res) => {
                              if (res && res[0]?.url) {
                                setEditFormData((prev) => ({
                                  ...prev,
                                  image_url: res[0].url,
                                }));
                              }
                            }}
                            content={{
                              button({ ready }) {
                                if (ready)
                                  return (
                                    <div
                                      className="w-full overflow-visible flex items-center justify-center"
                                      style={{
                                        paddingTop: "0.5rem",
                                        paddingBottom: "0.5rem",
                                      }}
                                    >
                                      <div className="font-head rounded outline-hidden cursor-pointer duration-200 font-medium flex items-center shadow-md hover:shadow active:shadow-none bg-secondary shadow-primary text-secondary-foreground border-2 border-black transition hover:translate-y-1 active:translate-y-2 active:translate-x-1 hover:bg-secondary-hover px-4 py-1.5 text-base">
                                        Carregar imagem
                                      </div>
                                    </div>
                                  );
                                return (
                                  <div
                                    className="w-full overflow-visible flex items-center justify-center"
                                    style={{
                                      paddingTop: "0.5rem",
                                      paddingBottom: "0.5rem",
                                    }}
                                  >
                                    <div className="font-head rounded outline-hidden cursor-not-allowed duration-200 font-medium flex items-center shadow-md bg-secondary shadow-primary text-secondary-foreground border-2 border-black px-4 py-1.5 text-base opacity-50">
                                      Carregando...
                                    </div>
                                  </div>
                                );
                              },
                              allowedContent({
                                ready,
                                fileTypes,
                                isUploading,
                              }) {
                                return "";
                              },
                            }}
                            className="w-full px-0 py-0 overflow-visible"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleEditCancel}
                        disabled={saveLoading}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="button"
                        onClick={handleEditSave}
                        disabled={saveLoading}
                      >
                        {saveLoading ? "Salvando..." : "Salvar Alterações"}
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-4">
                    <h1 className="text-3xl font-bold text-foreground">
                      {product.nome}
                    </h1>
                    {isOwner && (
                      <Button
                        variant="outline"
                        onClick={() => setIsEditMode(true)}
                      >
                        Editar
                      </Button>
                    )}
                  </div>
                  {product.image_url && (
                    <div className="mb-6">
                      <div className="relative w-full border border-input rounded-md overflow-hidden bg-muted">
                        <img
                          src={product.image_url}
                          alt={product.nome}
                          className="w-full h-auto max-h-96 object-contain mx-auto"
                        />
                      </div>
                    </div>
                  )}
                  <p className="text-lg text-muted-foreground mb-2">
                    Marca: {product.marca}
                  </p>
                  {product.desc && (
                    <p className="text-foreground mb-6">{product.desc}</p>
                  )}
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-primary">
                      R$ {product.preco.toFixed(2)}
                    </span>
                  </div>
                  {user && (
                    <div className="flex items-center gap-4 mb-6">
                      <Label htmlFor="quantity">Quantidade:</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(parseInt(e.target.value) || 1)
                        }
                        className="w-20"
                      />
                      <Button onClick={handleAddToCart}>
                        Adicionar ao Carrinho
                      </Button>
                    </div>
                  )}
                  {!user && (
                    <p className="text-sm text-muted-foreground">
                      Por favor,{" "}
                      <a href="/login" className="text-primary hover:underline">
                        faça login
                      </a>{" "}
                      para adicionar itens ao carrinho.
                    </p>
                  )}
                </>
              )}
            </Card.Content>
          </Card>
        </div>
      </div>
    </>
  );
}
