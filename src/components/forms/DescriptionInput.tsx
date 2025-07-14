import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function DescriptionInput({ value, onChange, error }: DescriptionInputProps) {
  return (
    <div>
      <Label htmlFor="description">Description</Label>
      <Input
        id="description"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Description du paiement"
        required
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
