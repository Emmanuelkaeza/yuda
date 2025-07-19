import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import api from '@/services/api';

interface PaymentDetailData {
  id: number;
  transactionId: string;
  amount: number;
  currency: string;
  method: string;
  type: string;
  status: string;
  description: string;
  cinetpayTransactionId: string | null;
  externalReference: string | null;
  metadata: {
    customerName: string;
    customerEmail: string;
    returnUrl: string;
    notifyUrl: string;
    cinetpayUrl?: string;
  };
  patient: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export function PaymentDetail() {
  const { id } = useParams();
  const [payment, setPayment] = useState<PaymentDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentDetail = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/payments/${id}`);
        setPayment(response.data.data);
      } catch (err) {
        setError('Erreur lors de la récupération des détails du paiement');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPaymentDetail();
    }
  }, [id]);

  if (loading) {
    return <div>Chargement des détails du paiement...</div>;
  }

  if (error || !payment) {
    return <div className="text-red-500">{error || 'Paiement non trouvé'}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <h1 className="text-3xl font-bold">Détails du Paiement</h1>
          <p className="text-sm text-muted-foreground">Transaction: {payment.transactionId}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Informations principales */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/20 rounded-lg">
            <div>
              <h2 className="text-lg font-semibold mb-4">Informations de paiement</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Montant:</span>
                  <span className="font-medium">{payment.amount} {payment.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Méthode:</span>
                  <span className="font-medium capitalize">{payment.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-medium capitalize">{payment.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Statut:</span>
                  <Badge variant={
                    payment.status === 'completed' ? 'default' :
                    payment.status === 'pending' ? 'warning' :
                    'destructive'
                  }>
                    {payment.status}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-4">Informations du patient</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nom:</span>
                  <span className="font-medium">{payment.metadata.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{payment.metadata.customerEmail}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Détails supplémentaires */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Détails de la transaction</h2>
            <div className="grid grid-cols-2 gap-4">
              {payment.cinetpayTransactionId && (
                <div className="p-3 bg-muted/10 rounded">
                  <p className="text-sm text-muted-foreground">ID CinetPay</p>
                  <p className="font-medium">{payment.cinetpayTransactionId}</p>
                </div>
              )}
              {payment.externalReference && (
                <div className="p-3 bg-muted/10 rounded">
                  <p className="text-sm text-muted-foreground">Référence Externe</p>
                  <p className="font-medium">{payment.externalReference}</p>
                </div>
              )}
            </div>
          </div>

          {/* Métadonnées */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">URLs de redirection</h2>
            <div className="space-y-2 text-sm">
              {payment.metadata.returnUrl && (
                <div className="p-3 bg-muted/10 rounded">
                  <p className="text-muted-foreground">URL de retour</p>
                  <p className="font-medium break-all">{payment.metadata.returnUrl}</p>
                </div>
              )}
              {payment.metadata.notifyUrl && (
                <div className="p-3 bg-muted/10 rounded">
                  <p className="text-muted-foreground">URL de notification</p>
                  <p className="font-medium break-all">{payment.metadata.notifyUrl}</p>
                </div>
              )}
              {payment.metadata.cinetpayUrl && (
                <div className="p-3 bg-muted/10 rounded">
                  <p className="text-muted-foreground">URL CinetPay</p>
                  <p className="font-medium break-all">{payment.metadata.cinetpayUrl}</p>
                </div>
              )}
            </div>
          </div>

          {/* Horodatage */}
          <div className="flex justify-between text-sm text-muted-foreground pt-4 border-t">
            <div>
              Créé le: {new Date(payment.createdAt).toLocaleString('fr-FR')}
            </div>
            <div>
              Dernière mise à jour: {new Date(payment.updatedAt).toLocaleString('fr-FR')}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
