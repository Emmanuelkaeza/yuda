import api from './api';
import { Payment, CreatePaymentDTO } from '@/types/payment';

export const paymentService = {
  getAllPayments: async (): Promise<Payment[]> => {
    const response = await api.get('/payments');
    if (!response.data.success) {
      throw new Error(response.data.message || 'Erreur lors de la récupération des paiements');
    }
    return Array.isArray(response.data.data.data) ? response.data.data.data : [];
  },

  getPayment: async (id: string): Promise<Payment> => {
    const response = await api.get(`/payments/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Erreur lors de la récupération du paiement');
    }
    return response.data.data;
  },

  createPayment: async (paymentData: CreatePaymentDTO): Promise<Payment> => {
    const response = await api.post('/payments', paymentData);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Erreur lors de la création du paiement');
    }
    return response.data.data;
  },

  // Processus de paiement
  processPayment: async (paymentId: string): Promise<Payment> => {
    const response = await api.post(`/payments/${paymentId}/process`);
    return response.data;
  },

  refundPayment: async (paymentId: string, reason?: string): Promise<Payment> => {
    const response = await api.post(`/payments/${paymentId}/refund`, { reason });
    return response.data;
  },

  // Factures
  getInvoice: async (paymentId: string): Promise<{ url: string; number: string }> => {
    const response = await api.get(`/payments/${paymentId}/invoice`);
    return response.data;
  },

  // Statistiques des paiements
  getPaymentStats: async (params?: {
    startDate?: string;
    endDate?: string;
    status?: Payment['status'];
  }): Promise<{
    totalAmount: number;
    totalCount: number;
    successRate: number;
    averageAmount: number;
    paymentMethodsDistribution: Record<string, number>;
  }> => {
    const response = await api.get('/payments/stats', { params });
    return response.data;
  },



  // Recherche de paiements
  searchPayments: async (query: {
    startDate?: string;
    endDate?: string;
    minAmount?: number;
    maxAmount?: number;
    status?: Payment['status'];
    paymentMethod?: Payment['paymentMethod']['type'];
  }): Promise<Payment[]> => {
    const response = await api.get('/payments/search', { params: query });
    return response.data;
  },

};
