"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getPaymentMethods } from "@/lib/api";
import type { Pagamento } from "@/lib/types";
import Navbar from "@/components/Navbar";
import PaymentMethodForm from "@/components/PaymentMethodForm";
import Loading from "@/components/Loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function PaymentMethodsPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [paymentMethods, setPaymentMethods] = useState<Pagamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (user) {
      loadPaymentMethods();
    }
  }, [user, authLoading, router]);

  const loadPaymentMethods = async () => {
    try {
      setLoading(true);
      const methods = await getPaymentMethods();
      setPaymentMethods(methods);
    } catch (err) {
      if (err instanceof Error && err.message.includes("Unauthorized")) {
        // Handle 401 by logging out through AuthContext
        logout();
        router.push("/login");
        return;
      }
      setError(
        err instanceof Error ? err.message : "Falha ao carregar métodos de pagamento"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentMethodAdded = () => {
    setShowForm(false);
    loadPaymentMethods();
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
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Métodos de Pagamento
            </h1>
            {!showForm && (
              <Button onClick={() => setShowForm(true)}>
                Adicionar Método de Pagamento
              </Button>
            )}
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {showForm ? (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Adicionar Novo Método de Pagamento</CardTitle>
              </CardHeader>
              <CardContent>
                <PaymentMethodForm
                  onSuccess={handlePaymentMethodAdded}
                  onCancel={() => setShowForm(false)}
                />
              </CardContent>
            </Card>
          ) : null}

          <Card>
            {paymentMethods.length === 0 ? (
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">Nenhum método de pagamento salvo.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Clique em "Adicionar Método de Pagamento" para adicionar um.
                </p>
              </CardContent>
            ) : (
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-lg font-semibold text-foreground">
                            **** **** **** {method.numero_cartao.slice(-4)}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {method.nome_titular}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Expira em:{" "}
                            {new Date(method.data_validade).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-sm text-muted-foreground">CVV: ***</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
