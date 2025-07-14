import { Metadata } from './metadata';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'receptionist';
  createdAt: string;
  updatedAt: string;
}

export interface Patient {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  medicalHistory: string;
  allergies: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Subscription {
  id: string;
  patientId: string;
  planId: string;
  status: 'active' | 'inactive' | 'cancelled' | 'expired';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  planDetails: {
    name: string;
    description: string;
    price: number;
    duration: number; // en mois
    features: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  patientId: string;
  subscriptionId?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: {
    type: 'card' | 'cash' | 'bank_transfer';
    details: {
      last4?: string;
      brand?: string;
      bankName?: string;
    };
  };
  invoice: {
    number: string;
    url?: string;
  };
  metadata?: Metadata;
  createdAt: string;
  updatedAt: string;
}
