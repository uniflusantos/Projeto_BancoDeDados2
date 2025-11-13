"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, getTotal, clearCart } =
    useCart();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground mb-8">
            Carrinho de Compras
          </h1>
          {items.length === 0 ? (
            <Card>
              <Card.Content className="p-8 text-center">
                <p className="text-muted-foreground mb-4">
                  Seu carrinho está vazio.
                </p>
                <Button asChild>
                  <Link href="/">Continuar Comprando</Link>
                </Button>
              </Card.Content>
            </Card>
          ) : (
            <Card>
              <Card.Header>
                <div className="grid grid-cols-12 gap-4 text-sm font-medium">
                  <div className="col-span-5">Produto</div>
                  <div className="col-span-2 text-center">Preço</div>
                  <div className="col-span-2 text-center">Quantidade</div>
                  <div className="col-span-2 text-center">Total</div>
                  <div className="col-span-1"></div>
                </div>
              </Card.Header>
              <Separator />
              <Card.Content className="p-0">
                <div className="divide-y">
                  {items.map((item) => (
                    <div key={item.product.product_id} className="px-6 py-4">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-5">
                          <Link
                            href={`/products/${item.product.product_id}`}
                            className="text-lg font-semibold text-foreground hover:text-primary transition-colors"
                          >
                            {item.product.nome}
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            {item.product.marca}
                          </p>
                        </div>
                        <div className="col-span-2 text-center">
                          R$ {item.product.preco.toFixed(2)}
                        </div>
                        <div className="col-span-2">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(
                                  item.product.product_id,
                                  item.quantity - 1
                                )
                              }
                            >
                              −
                            </Button>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(
                                  item.product.product_id,
                                  parseInt(e.target.value) || 1
                                )
                              }
                              className="w-16 text-center"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(
                                  item.product.product_id,
                                  item.quantity + 1
                                )
                              }
                            >
                              +
                            </Button>
                          </div>
                        </div>
                        <div className="col-span-2 text-center font-semibold">
                          R$ {(item.product.preco * item.quantity).toFixed(2)}
                        </div>
                        <div className="col-span-1">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              removeFromCart(item.product.product_id)
                            }
                            className="text-destructive-foreground hover:text-destructive-foreground/80 bg-destructive"
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
              <Separator />
              <Card.Footer className="flex-col gap-4 pt-6">
                <div className="flex justify-between items-center w-full">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-2xl font-bold text-primary">
                    R$ {getTotal().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-end gap-4 w-full">
                  <Button variant="outline" asChild>
                    <Link href="/">Continuar Comprando</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/checkout">Finalizar Compra</Link>
                  </Button>
                </div>
              </Card.Footer>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
