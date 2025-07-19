import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import api from '@/services/api';

interface Payment {
  id: number;
  transactionId: string;
  amount: number;
  currency: string;
  method: string;
  type: string;
  status: string;
  description: string;
  createdAt: string;
}

interface PaymentResponse {
  success: boolean;
  data: {
    data: Payment[];
    totalPages: number;
  };
}

export function PaymentsList() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleRowClick = (paymentId: number) => {
    navigate(`/payments/${paymentId}`);
  };

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const response = await api.get<PaymentResponse>('/payments');
        setPayments(response.data.data.data);
      } catch (err) {
        setError('Erreur lors de la récupération des paiements');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) {
    return <div>Chargement des paiements...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold">Liste des Paiements</h2>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Transaction</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Devise</TableHead>
              <TableHead>Méthode</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow 
                key={payment.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleRowClick(payment.id)}
              >
                <TableCell>{payment.transactionId}</TableCell>
                <TableCell>{payment.amount}</TableCell>
                <TableCell>{payment.currency}</TableCell>
                <TableCell>{payment.method}</TableCell>
                <TableCell>{payment.type}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded ${
                    payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                    payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {payment.status}
                  </span>
                </TableCell>
                <TableCell>{payment.description}</TableCell>
                <TableCell>{new Date(payment.createdAt).toLocaleDateString('fr-FR')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
