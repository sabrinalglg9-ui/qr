export interface Attendee {
  id: string;
  uuid: string;
  firstName: string;
  lastName: string;
  dni: string;
  phone: string;
  email: string;
  paymentStatus: 'pending' | 'approved' | 'rejected';
  qrUsed: boolean;
  purchaseDate: string;
  entryDate: string | null;
  paymentId: string;
}

export interface PaymentPreference {
  id: string;
  uuid: string;
  email: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
}

export interface QRScanResult {
  success: boolean;
  message: string;
  attendee?: Attendee;
  error?: string;
}
