export type PaymentMethod = 'cash' | 'card' | 'mobile_money' | 'cinetpay';
export type PaymentCurrency = 'XOF' | 'USD' | 'EUR';
export type PaymentType = 'subscription' | 'consultation' | 'treatment' | 'other';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Payment {
  id: string;
  amount: number;
  currency: PaymentCurrency;
  method: PaymentMethod;
  type: PaymentType;
  description: string;
  patientId: string;
  status: PaymentStatus;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentDTO {
  amount: number;
  currency: PaymentCurrency;
  method: PaymentMethod;
  type: PaymentType;
  description: string;
  patientId: string;
}

export interface PaymentInitResponse {
  success: boolean;
  transactionId: string;
  paymentUrl: string;
}
