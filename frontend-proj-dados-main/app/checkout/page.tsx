"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { getPaymentMethods, createPurchase } from "@/lib/api";
import type { Pagamento } from "@/lib/types";
import Navbar from "@/components/Navbar";
import PaymentMethodForm from "@/components/PaymentMethodForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { showPurchaseSuccessToast } from "@/components/PurchaseSuccessSonner";

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [paymentMethods, setPaymentMethods] = useState<Pagamento[]>([]);
  const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(
    null
  );
  const [showNewPaymentForm, setShowNewPaymentForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (items.length === 0) {
      router.push("/cart");
      return;
    }
    loadPaymentMethods();
  }, [user, items.length, router]);

  const loadPaymentMethods = async () => {
    try {
      const methods = await getPaymentMethods();
      setPaymentMethods(methods);
      if (methods.length > 0) {
        setSelectedPaymentId(methods[0].id || null);
      }
    } catch (err) {
      console.error("Failed to load payment methods:", err);
    }
  };

  const handlePaymentMethodAdded = () => {
    setShowNewPaymentForm(false);
    loadPaymentMethods();
  };

  const handleCompletePurchase = async () => {
    if (!selectedPaymentId || !user) {
      setError("Por favor, selecione um método de pagamento");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Create purchase for each item in cart
      for (const item of items) {
        await createPurchase({
          user_id: user.id!,
          product_id: item.product.product_id,
          quantidade: item.quantity,
          data_compra: new Date().toISOString(),
          valor_pago: item.product.preco * item.quantity,
          valor_produto: item.product.preco,
        });
      }

      clearCart();
      showPurchaseSuccessToast();
      router.push("/profile?success=true");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Falha ao finalizar compra"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user || items.length === 0) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground mb-8">Finalizar Compra</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-4">
                  {items.map((item) => (
                    <div
                      key={item.product.product_id}
                      className="flex justify-between"
                    >
                      <div>
                        <p className="font-medium">{item.product.nome}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} × R$ {item.product.preco.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-medium">
                        R$ {(item.product.preco * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold mt-4">
                  <span>Total:</span>
                  <span className="text-primary">
                    R$ {getTotal().toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Método de Pagamento</CardTitle>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {showNewPaymentForm ? (
                  <PaymentMethodForm
                    onSuccess={handlePaymentMethodAdded}
                    onCancel={() => setShowNewPaymentForm(false)}
                  />
                ) : (
                  <>
                    {paymentMethods.length > 0 ? (
                      <div className="space-y-3 mb-4">
                        {paymentMethods.map((method) => (
                          <label
                            key={method.id}
                            className={cn(
                              "block p-4 border-2 rounded-md cursor-pointer transition-colors",
                              selectedPaymentId === method.id
                                ? "border-primary bg-primary/10"
                                : "border-border hover:border-primary/50"
                            )}
                          >
                            <input
                              type="radio"
                              name="payment"
                              value={method.id?.toString() || ""}
                              checked={selectedPaymentId === method.id}
                              onChange={() =>
                                setSelectedPaymentId(method.id || null)
                              }
                              className="mr-2"
                            />
                            <span className="font-medium">
                              **** **** **** {method.numero_cartao.slice(-4)}
                            </span>
                            <p className="text-sm text-muted-foreground">
                              {method.nome_titular}
                            </p>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground mb-4">
                        Nenhum método de pagamento salvo.
                      </p>
                    )}

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowNewPaymentForm(true)}
                      className="mb-4"
                    >
                      + Adicionar Novo Método de Pagamento
                    </Button>

                    <Button
                      onClick={handleCompletePurchase}
                      disabled={loading || !selectedPaymentId}
                      className="w-full"
                    >
                      {loading ? "Processando..." : "Finalizar Compra"}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
