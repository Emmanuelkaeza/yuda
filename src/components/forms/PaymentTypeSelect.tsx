import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PaymentType } from "@/types/payment";

interface PaymentTypeSelectProps {
  value: PaymentType;
  onChange: (value: string) => void;
}

export default function PaymentTypeSelect({ value, onChange }: PaymentTypeSelectProps) {
  return (
    <div>
      <Label htmlFor="type">Type de paiement</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Choisir un type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="subscription">Abonnement</SelectItem>
          <SelectItem value="consultation">Consultation</SelectItem>
          <SelectItem value="treatment">Traitement</SelectItem>
          <SelectItem value="other">Autre</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
