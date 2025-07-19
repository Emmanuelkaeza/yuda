import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface StatusStat {
    status: string;
    count: number;
    totalAmount: number;
}

interface MethodStat {
    method: string;
    count: number;
    totalAmount: number;
}

interface PaymentStats {
    totalPayments: number;
    totalRevenue: number;
    statusStats: StatusStat[];
    methodStats: MethodStat[];
}

interface Payment {
    id: string;
    transactionId: string;
    amount: number;
    currency: string;
    method: string;
    type: string;
    status: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

const TableauPayment: React.FC = () => {
    const [paymentStats, setPaymentStats] = useState<PaymentStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPaymentStats = async () => {
            try {
                const response = await api.get('/payments/stats');
                if (response.data) {
                    setPaymentStats({
                        totalPayments: response.data.totalPayments || 0,
                        totalRevenue: response.data.totalRevenue || 0,
                        statusStats: response.data.statusStats || [],
                        methodStats: response.data.methodStats || []
                    });
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des statistiques de paiement:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPaymentStats();
    }, []);

    if (isLoading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Résumé des statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <h3 className="text-lg font-semibold">Total des paiements</h3>
                        <p className="text-2xl">{paymentStats?.totalPayments || 0}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <h3 className="text-lg font-semibold">Revenu total</h3>
                        <p className="text-2xl">{paymentStats?.totalRevenue?.toLocaleString('fr-FR')} USD</p>
                    </CardContent>
                </Card>
            </div>

            {/* Tableau des statistiques par statut */}
            <Card>
                <CardHeader>
                    <CardTitle>Statistiques par statut</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Statut</TableHead>
                                <TableHead className="text-right">Nombre</TableHead>
                                <TableHead className="text-right">Montant total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {!paymentStats?.statusStats || paymentStats.statusStats.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center">Aucune donnée disponible</TableCell>
                                </TableRow>
                            ) : (
                                paymentStats.statusStats.map((stat) => (
                                <TableRow key={stat.status}>
                                    <TableCell>
                                        {stat.status === 'pending' ? <Badge variant="secondary">En attente</Badge> :
                                         stat.status === 'completed' ? <Badge className="bg-green-500 hover:bg-green-600">Complété</Badge> :
                                         stat.status === 'failed' ? <Badge variant="destructive">Échoué</Badge> :
                                         stat.status === 'refunded' ? <Badge variant="outline">Remboursé</Badge> :
                                         <Badge variant="outline">{stat.status}</Badge>}
                                    </TableCell>
                                    <TableCell className="text-right">{stat.count}</TableCell>
                                    <TableCell className="text-right">{stat.totalAmount.toLocaleString('fr-FR')} USD</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Tableau des statistiques par méthode de paiement */}
            <Card>
                <CardHeader>
                    <CardTitle>Statistiques par méthode de paiement</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Méthode de paiement</TableHead>
                                <TableHead className="text-right">Nombre</TableHead>
                                <TableHead className="text-right">Montant total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {!paymentStats?.methodStats || paymentStats.methodStats.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center">Aucune donnée disponible</TableCell>
                                </TableRow>
                            ) : (
                                paymentStats.methodStats.map((stat) => (
                                <TableRow key={stat.method}>
                                    <TableCell>{stat.method === 'cinetpay' ? 'CinetPay' : stat.method}</TableCell>
                                    <TableCell className="text-right">{stat.count}</TableCell>
                                    <TableCell className="text-right">{stat.totalAmount.toLocaleString('fr-FR')} USD</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default TableauPayment;