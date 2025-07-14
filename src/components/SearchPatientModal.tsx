import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Patient } from "@/types";

interface SearchPatientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSearch: (searchTerm: string) => void;
}

export function SearchPatientModal({ open, onOpenChange, onSearch }: SearchPatientModalProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rechercher un patient</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            placeholder="Nom, prénom, email ou téléphone..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
