import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PaymentCurrency } from "@/types/payment";

interface CurrencySelectProps {
  value: PaymentCurrency;
  onChange: (value: string) => void;
}

export default function CurrencySelect({ value, onChange }: CurrencySelectProps) {
  return (
    <div>
      <Label htmlFor="currency">Devise</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Choisir une devise" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="CDF">CDF - Franc Congolais</SelectItem>
          <SelectItem value="USD">USD - Dollar US</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
