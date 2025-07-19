import { useState, useEffect, useMemo, useCallback } from "react";
import { CreatePaymentDTO, PaymentCurrency, PaymentMethod, PaymentType, PaymentInitResponse } from "@/types/payment";
import { Patient } from "@/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import AmountInput from "./AmountInput";
import PaymentMethodSelect from "./PaymentMethodSelect";
import CurrencySelect from "./CurrencySelect";
import DescriptionInput from "./DescriptionInput";

interface PaymentFormProps {
  patient: Patient;
  onSubmit: (payment: CreatePaymentDTO) => Promise<PaymentInitResponse>;
  onCancel: () => void;
}

export function PaymentForm({ patient, onSubmit, onCancel }: PaymentFormProps) {
  // État initial
  const initialFormData: CreatePaymentDTO = {
    amount: 0,
    currency: 'CDF',
    method: 'cash',
    type: 'consultation',
    description: '',
    patientId: 0,
    metadata: {
      customerName: '',
      customerEmail: '',
      returnUrl: window.location.origin + '/payment-success',
      notifyUrl: window.location.origin + '/api/payments/webhook'
    }
  };

  const [formData, setFormData] = useState<CreatePaymentDTO>(initialFormData);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  // Initialiser le formulaire avec les valeurs par défaut et l'ID du patient
  useEffect(() => {
    if (patient?.id) {
      setFormData(prev => ({
        ...prev,
        patientId: Number(patient.id),
        currency: 'CDF',
        method: 'cinetpay',
        type: 'consultation',
        metadata: {
          ...prev.metadata,
          customerName: `${patient.firstName} ${patient.lastName}`,
          customerEmail: patient.email || '',
        }
      }));
    }
  }, [patient]);

  // Fonction handleChange avec useCallback
  const handleChange = useCallback((name: keyof CreatePaymentDTO, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Supprimer l'erreur correspondante si elle existe
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);



  // Fonction de validation
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    // Validation du patient
    if (!formData.patientId) {
      newErrors.patientId = "Veuillez sélectionner un patient";
    }

    // Validation du montant
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = "Le montant doit être supérieur à 0";
    }

    // Validation de la devise
    if (!formData.currency) {
      newErrors.currency = "La devise est requise";
    }

    // Validation de la méthode de paiement
    if (!formData.method) {
      newErrors.method = "La méthode de paiement est requise";
    }

    // Validation du type de paiement
    if (!formData.type) {
      newErrors.type = "Le type de paiement est requis";
    }

    // Validation de la description
    if (!formData.description || !formData.description.trim()) {
      newErrors.description = "La description est requise";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Fonction de soumission avec useCallback
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsProcessing(true);
      
      // Vérification des données avant l'envoi
      const paymentData = {
        ...formData,
        amount: Number(formData.amount),
        patientId: formData.patientId
      };

      console.log('Données de paiement à envoyer:', paymentData);
      
      const response = await onSubmit(paymentData);
      
      if (response && response.metadata.cinetpayUrl) {
        window.open(response.metadata.cinetpayUrl, '_blank');
        toast({
          title: "Succès",
          description: "Redirection vers la page de paiement CinetPay...",
          variant: "default"
        });
      } else {
        toast({
          title: "Erreur",
          description: response.message || "Échec de l'initialisation du paiement",
          variant: "destructive"
        });
        console.error("Payment submission failed:", response.metadata);
      }
    } catch (error) {
      console.error("Payment submission error:", error);
      toast({
        title: "Erreur",
        description: error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de l'initialisation du paiement",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [formData, onSubmit, validateForm, toast]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {/* Le patient est déjà fourni en props, pas besoin de PatientSearch */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Patient</label>
            <div className="p-2 border rounded-md">
              {patient?.firstName} {patient?.lastName}
            </div>
          </div>

          <AmountInput
            value={formData.amount}
            onChange={(value) => handleChange('amount', parseFloat(value) || 0)}
            error={errors.amount}
          />

          <CurrencySelect
            value={formData.currency as PaymentCurrency}
            onChange={(value) => handleChange('currency', value)}
          />

        </div>

        <div className="space-y-4">
          <PaymentMethodSelect
            value={formData.method}
            onChange={(value) => handleChange('method', value as PaymentMethod)}
          />

          <DescriptionInput
            value={formData.description}
            onChange={(value) => handleChange('description', value)}
            error={errors.description}
          />
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        {isProcessing && (
          <div className="flex items-center justify-center text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Patientez pendant l'initialisation du paiement...
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isProcessing}>
            Annuler
          </Button>
          <Button type="submit" disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Traitement...
              </>
            ) : (
              "Confirmer le paiement"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
