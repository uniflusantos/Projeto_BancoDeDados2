"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getUserPurchases, getProducts, deleteProduct } from "@/lib/api";
import type { Compras, Product } from "@/lib/types";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Loading from "@/components/Loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/retroui/Button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import CommerceCard from "@/components/CommerceCard";

function ProfileContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [purchases, setPurchases] = useState<Compras[]>([]);
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setSuccess(true);
      // Clear the success parameter from URL
      router.replace("/profile");
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login");
        return;
      }
      loadPurchases();
      loadUserProducts();
    }
  }, [user, authLoading, router]);

  const loadPurchases = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const data = await getUserPurchases(user.id);
      setPurchases(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao carregar compras");
    } finally {
      setLoading(false);
    }
  };

  const loadUserProducts = async () => {
    if (!user?.id) return;

    try {
      const allProducts = await getProducts();
      const filtered = allProducts.filter(
        (product) => product.owner_id === user.id
      );
      setUserProducts(filtered);
    } catch (err) {
      console.error("Failed to load user products:", err);
      // Don't set error state here as it's not critical for page rendering
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      await deleteProduct(productId);
      setUserProducts((prevProducts) =>
        prevProducts.filter((p) => p.product_id !== productId)
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Falha ao excluir produto"
      );
    }
  };

  if (authLoading || loading) {
    return (
      <>
        <Navbar />
        <Loading />
      </>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground mb-8">Perfil</h1>

          {success && (
            <Alert className="mb-4">
              <AlertDescription>
                Compra realizada com sucesso!
              </AlertDescription>
            </Alert>
          )}

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Informações do Usuário</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="font-medium">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nome de usuário</p>
                  <p className="font-medium">{user.username}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">E-mail</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Idade</p>
                  <p className="font-medium">{user.age}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">CPF</p>
                  <p className="font-medium">{user.cpf}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Endereço</p>
                  <p className="font-medium">{user.endereco}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mb-4">
            <Button asChild>
              <Link href="/payment-methods">Gerenciar Métodos de Pagamento</Link>
            </Button>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Meus Produtos</CardTitle>
            </CardHeader>
            <CardContent>
              {userProducts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Nenhum produto criado ainda.
                  </p>
                  <Button asChild>
                    <Link href="/products/new">Criar Seu Primeiro Produto</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userProducts.map((product) => (
                    <CommerceCard
                      key={product.product_id}
                      product={product}
                      user={user}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Histórico de Compras</CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {purchases.length === 0 ? (
                <p className="text-muted-foreground">Nenhuma compra ainda.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          ID do Produto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Quantidade
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Preço Unitário
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Total Pago
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Data
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-background divide-y divide-border">
                      {purchases.map((purchase, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {purchase.product_id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {purchase.quantidade}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            R$ {purchase.valor_produto.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            R$ {purchase.valor_pago.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {new Date(
                              purchase.data_compra
                            ).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <>
          <Navbar />
          <Loading />
        </>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
