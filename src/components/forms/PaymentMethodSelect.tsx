import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PaymentMethod } from "@/types/payment";

interface PaymentMethodSelectProps {
  value: PaymentMethod;
  onChange: (value: string) => void;
}

export default function PaymentMethodSelect({ value, onChange }: PaymentMethodSelectProps) {
  return (
    <div>
      <Label htmlFor="method">Méthode de paiement</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Choisir une méthode" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="cinetpay">CinetPay</SelectItem>
          <SelectItem value="card">Carte bancaire</SelectItem>
          <SelectItem value="cash">Espèces</SelectItem>
          <SelectItem value="mobile_money">Mobile Money</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
