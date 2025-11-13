"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/types";
import type { UserWithRelations } from "@/lib/types";
import { Button } from "@/components/retroui/Button";
import { Button as UIButton } from "@/components/ui/button";
import { Card } from "@/components/retroui/Card";
import { useCart } from "@/contexts/CartContext";

interface CommerceCardProps {
  product: Product;
  user?: UserWithRelations | null;
  onDelete?: (productId: string) => void;
}

export default function CommerceCard({
  product,
  user,
  onDelete,
}: CommerceCardProps) {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const isOwner = user?.id === product.owner_id;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      onDelete &&
      window.confirm(
        `Tem certeza que deseja excluir "${product.nome}"? Esta ação não pode ser desfeita.`
      )
    ) {
      onDelete(product.product_id);
    }
  };

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isOwner && isHovered && (
        <UIButton
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 z-10"
          onClick={handleDelete}
          aria-label={`Delete ${product.nome}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        </UIButton>
      )}
      <Link href={`/products/${product.product_id}`} className="block">
        <Card className="w-full shadow-none hover:shadow-none">
          <Card.Content className="pb-0">
            <img
              src={product.image_url || "/images/gameboy.jpg"}
              className="w-full h-full"
              alt={product.nome}
            />
          </Card.Content>
          <Card.Header className="pb-0">
            <Card.Title>{product.nome}</Card.Title>
          </Card.Header>
          <Card.Content className="flex justify-between items-center">
            <p className="text-lg font-semibold">
              R$ {product.preco.toFixed(2)}
            </p>
            <Button onClick={handleAddToCart}>Adicionar ao carrinho</Button>
          </Card.Content>
        </Card>
      </Link>
    </div>
  );
}
