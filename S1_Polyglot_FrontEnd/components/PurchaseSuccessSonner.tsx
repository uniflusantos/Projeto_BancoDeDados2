import { toast } from "sonner";

export function showPurchaseSuccessToast() {
  toast.success("Compra realizada com sucesso!");
}

// Keep the component for backwards compatibility if needed
export default function SonnerStyleStatus() {
  const onClick = () => {
    showPurchaseSuccessToast();
  };

  return <button onClick={onClick}>OK</button>;
}
