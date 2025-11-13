"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createProduct } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { ProductCreate } from "@/lib/types";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/retroui/Card";
import { Button } from "@/components/retroui/Button";
import { Input } from "@/components/retroui/Input";
import { Label } from "@/components/retroui/Label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UploadButton } from "@/lib/uploadthing";
import { UploadThingWrapper } from "@/components/UploadThingWrapper";
import { Textarea } from "@/components/retroui/Textarea";

export default function NewProductPage() {
  const [formData, setFormData] = useState<
    Omit<ProductCreate, "desc"> & { desc: string }
  >({
    nome: "",
    preco: 0,
    marca: "",
    desc: "",
    product_id: "",
    created_at: new Date().toISOString(),
    image_url: null,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "preco" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Generate product_id if not provided
    const productId = formData.product_id || `prod-${Date.now()}`;

    try {
      await createProduct({
        ...formData,
        product_id: productId,
      });
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao criar produto");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground mb-8">
            Adicionar Novo Produto
          </h1>
          <Card className="w-full">
            <Card.Content className="p-8">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Produto *</Label>
                  <Input
                    id="nome"
                    name="nome"
                    type="text"
                    required
                    value={formData.nome}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="marca">Marca *</Label>
                  <Input
                    id="marca"
                    name="marca"
                    type="text"
                    required
                    value={formData.marca}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preco">Preço *</Label>
                  <Input
                    id="preco"
                    name="preco"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.preco}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="desc">Descrição</Label>
                  <Textarea
                    id="desc"
                    name="desc"
                    rows={4}
                    // className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.desc}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product_id">
                    ID do Produto (deixe vazio para gerar automaticamente)
                  </Label>
                  <Input
                    id="product_id"
                    name="product_id"
                    type="text"
                    value={formData.product_id}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2 overflow-visible">
                  <Label>Imagem</Label>
                  {formData.image_url ? (
                    <div className="space-y-2">
                      <div className="relative w-full border border-input rounded-md overflow-hidden">
                        <img
                          src={formData.image_url}
                          alt="Pré-visualização do produto"
                          className="w-full h-auto max-h-64 object-contain"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            image_url: null,
                          }));
                        }}
                      >
                        Alterar Imagem
                      </Button>
                    </div>
                  ) : (
                    // <UploadThingWrapper>
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
                            setFormData((prev) => ({
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
                          allowedContent({ ready, fileTypes, isUploading }) {
                            return "";
                          },
                        }}
                        className="w-full px-0 py-0 overflow-visible"
                      />
                    </div>
                    // </UploadThingWrapper>
                  )}
                </div>

                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/")}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" variant="default" disabled={loading}>
                    {loading ? "Criando..." : "Criar produto"}
                  </Button>
                </div>
              </form>
            </Card.Content>
          </Card>
        </div>
      </div>
    </>
  );
}
