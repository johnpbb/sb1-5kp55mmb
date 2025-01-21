import { z } from 'zod';

export type PaymentMethod = 'card' | 'mpaisa';

export const PaymentConfigSchema = z.object({
  transactionId: z.string(),
  amount: z.number().positive(),
  clientId: z.string(),
  itemDetails: z.string(),
  merchantSecret: z.string(),
  responseCode: z.string()
});

export type PaymentConfig = z.infer<typeof PaymentConfigSchema>;

export type PaymentStatus = 
  | 'idle'
  | 'processing'
  | 'success'
  | 'failed'
  | 'cancelled';

export interface PaymentResponse {
  code: '101' | '102' | '108' | '111' | '112';
  message: string;
  transactionId: string;
}

export interface MPaisaConfig {
  apiUrl: string;
  clientId: string;
  merchantSecret: string;
  callbackUrl: string;
}