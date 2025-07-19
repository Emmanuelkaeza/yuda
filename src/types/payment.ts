export type PaymentMethod = 'cash' | 'cinetpay';
export type PaymentCurrency = 'CDF' | 'USD';
export type PaymentType = 'consultation';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Payment {
  id: string;
  amount: number;
  currency: PaymentCurrency;
  method: PaymentMethod;
  type: PaymentType;
  description: string;
  patientId: number;
  status: PaymentStatus;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMetadata {
  customerName: string;
  customerEmail: string;
  returnUrl: string;
  notifyUrl: string;
}

export interface CreatePaymentDTO {
  amount: number;
  currency: PaymentCurrency;
  method: PaymentMethod;
  type: PaymentType;
  description: string;
  patientId: number;
  metadata: PaymentMetadata;
}

export interface PaymentInitResponse {
  success: boolean;
  transactionId: string;
  paymentUrl: string;
}
