import api from './api';
import { Subscription } from '@/types';

export const subscriptionService = {
  getAllSubscriptions: async (): Promise<Subscription[]> => {
    const response = await api.get('/subscriptions');
    return response.data;
  },

  getPatientSubscriptions: async (patientId: string): Promise<Subscription[]> => {
    const response = await api.get(`/subscriptions/patient/${patientId}/active`);
    return response.data;
  },

  getSubscription: async (id: string): Promise<Subscription> => {
    const response = await api.get(`/subscriptions/${id}`);
    return response.data;
  },

  createSubscription: async (subscriptionData: {
    patientId: string;
    planId: string;
    startDate: string;
    autoRenew: boolean;
  }): Promise<Subscription> => {
    const response = await api.post('/subscriptions', subscriptionData);
    return response.data;
  },

  updateSubscription: async (id: string, updateData: Partial<Subscription>): Promise<Subscription> => {
    const response = await api.put(`/subscriptions/${id}`, updateData);
    return response.data;
  },

  cancelSubscription: async (id: string, reason?: string): Promise<Subscription> => {
    const response = await api.post(`/subscriptions/${id}/cancel`, { reason });
    return response.data;
  },

  renewSubscription: async (id: string): Promise<Subscription> => {
    const response = await api.post(`/subscriptions/${id}/renew`);
    return response.data;
  },

  // Gestion des plans d'abonnement
  getSubscriptionPlans: async (): Promise<Subscription['planDetails'][]> => {
    const response = await api.get('/subscription/plans');
    return response.data;
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
    return response.data;
  }
};
