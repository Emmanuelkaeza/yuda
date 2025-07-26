import api from './api';
import { Subscription } from '@/types';

export const subscriptionService = {
   async getAllSubscriptions(searchTerm = ""): Promise<Subscription[]> {
    const res = await api.get(`/subscriptions?search=${encodeURIComponent(searchTerm)}`);
    return res.data?.data?.data || []; // ← ici on va chercher profondément
  },

  getPatientSubscriptions: async (patientId: string): Promise<Subscription[]> => {
    const response = await api.get(`/subscriptions/patient/${patientId}/active`);
    return response.data.data;
  },

  getSubscription: async (id: string): Promise<Subscription> => {
    const response = await api.get(`/subscriptions/${id}`);
    return response.data.data;
  },

  createSubscription: async (subscriptionData: {
    patientId: string;
    planId: string;
    startDate: string;
    autoRenew: boolean;
  }): Promise<Subscription> => {
    const response = await api.post('/subscriptions', subscriptionData);
    return response.data.data;
  },

  updateSubscription: async (id: string, updateData: Partial<Subscription>): Promise<Subscription> => {
    const response = await api.put(`/subscriptions/${id}`, updateData);
    return response.data.data;
  },

  cancelSubscription: async (id: string, reason?: string): Promise<Subscription> => {
    const response = await api.patch(`/subscriptions/${id}/cancel`, { reason });
    return response.data;
  },

  renewSubscription: async (id: string): Promise<Subscription> => {
    const response = await api.post(`/subscriptions/${id}/renew`);
    return response.data.data;
  },

  // Gestion des plans d'abonnement
  getSubscriptionPlans: async (): Promise<Subscription['planDetails'][]> => {
    const response = await api.get('/subscription/plans');
    return response.data.data;
  },

  // Statistiques et rapports
  getSubscriptionStats: async (params?: {
    startDate?: string;
    endDate?: string;
    status?: Subscription['status'];
  }): Promise<{
    totalActive: number;
    totalRevenue: number;
    averageDuration: number;
    renewalRate: number;
  }> => {
    const response = await api.get('/subscriptions/stats', { params });
    return response.data.data;
  }
};
