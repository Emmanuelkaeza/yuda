import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AmountInputProps {
  value: number;
  onChange: (value: string) => void;
  error?: string;
}

export default function AmountInput({ value, onChange, error }: AmountInputProps) {
  return (
    <div>
      <Label htmlFor="amount">Montant</Label>
      <Input
        id="amount"
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0.00"
        min="0"
        step="1"
        required
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
