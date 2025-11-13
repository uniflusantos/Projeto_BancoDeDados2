"use client";

import { useState } from "react";
import { createPaymentMethod } from "@/lib/api";
import type { PagamentoCreateLogin } from "@/lib/types";
import { Button } from "@/components/retroui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PaymentMethodFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PaymentMethodForm({
  onSuccess,
  onCancel,
}: PaymentMethodFormProps) {
  const [formData, setFormData] = useState<PagamentoCreateLogin>({
    numero_cartao: "",
    nome_titular: "",
    data_validade: "",
    cod_seguranca: 0,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "cod_seguranca" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createPaymentMethod(formData);
      onSuccess();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Falha ao criar método de pagamento"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="numero_cartao">Número do Cartão *</Label>
        <Input
          id="numero_cartao"
          name="numero_cartao"
          type="text"
          required
          maxLength={16}
          value={formData.numero_cartao}
          onChange={handleChange}
          placeholder="1234 5678 9012 3456"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="nome_titular">Nome do Titular *</Label>
        <Input
          id="nome_titular"
          name="nome_titular"
          type="text"
          required
          value={formData.nome_titular}
          onChange={handleChange}
          placeholder="João Silva"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="data_validade">Data de Validade *</Label>
        <Input
          id="data_validade"
          name="data_validade"
          type="datetime-local"
          required
          value={formData.data_validade}
          onChange={handleChange}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cod_seguranca">CVV *</Label>
        <Input
          id="cod_seguranca"
          name="cod_seguranca"
          type="number"
          required
          min="100"
          max="9999"
          value={formData.cod_seguranca || ""}
          onChange={handleChange}
          placeholder="123"
        />
      </div>
      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" onClick={onCancel} variant="outline">
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
}
