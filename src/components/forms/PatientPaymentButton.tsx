import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PaymentForm } from "./PaymentForm";
import { Patient } from "@/types";
import { Loader2 } from "lucide-react";

interface PatientPaymentButtonProps {
  patient: Patient;
}

export function PatientPaymentButton({ patient }: PatientPaymentButtonProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePaymentSubmit = async (paymentData: any) => {
    try {
      setIsLoading(true);
      // Ici, ajoutez la logique pour soumettre le paiement
      // Vous pouvez utiliser le service de paiement existant
      setOpen(false);
    } catch (error) {
      console.error("Erreur lors du paiement:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="w-full md:w-auto">
          Effectuer un paiement
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nouveau paiement pour {patient.firstName} {patient.lastName}</DialogTitle>
        </DialogHeader>
        <PaymentForm 
          patient={patient}
          onSubmit={handlePaymentSubmit}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
