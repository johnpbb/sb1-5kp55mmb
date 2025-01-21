import { createHash } from 'crypto';
import { PaymentConfig, MPaisaConfig, PaymentResponse } from '../types/payment';

const config: MPaisaConfig = {
  apiUrl: import.meta.env.VITE_MPAISA_API_URL || 'https://pay.mpaisa.vodafone.com.fj/API',
  clientId: import.meta.env.VITE_MPAISA_CLIENT_ID || '',
  merchantSecret: import.meta.env.VITE_MPAISA_MERCHANT_SECRET || '',
  callbackUrl: import.meta.env.VITE_MPAISA_CALLBACK_URL || ''
};

export function generateToken(params: PaymentConfig): string {
  const data = `${params.transactionId}${params.amount}${params.itemDetails}${params.merchantSecret}${params.responseCode}`;
  return createHash('sha256').update(data).digest('hex');
}

export async function initializePayment(amount: number, itemDetails: string): Promise<string> {
  const transactionId = `TXN${Date.now()}`;
  const token = generateToken({
    transactionId,
    amount,
    clientId: config.clientId,
    itemDetails,
    merchantSecret: config.merchantSecret,
    responseCode: ''
  });

  const params = new URLSearchParams({
    url: config.callbackUrl,
    tID: transactionId,
    amt: amount.toString(),
    cID: config.clientId,
    iDet: itemDetails,
    token
  });

  return `${config.apiUrl}?${params.toString()}`;
}

export async function verifyTransaction(transactionId: string): Promise<PaymentResponse> {
  const response = await fetch(`https://pay.mpaisa.vodafone.com.fj/requeststatus/${transactionId}`);
  if (!response.ok) {
    throw new Error('Failed to verify transaction');
  }
  return response.json();
}