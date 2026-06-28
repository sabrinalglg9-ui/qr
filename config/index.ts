const MP_PUBLIC_KEY = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;
const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
const MP_WEBHOOK_SECRET = process.env.MP_WEBHOOK_SECRET;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';
const MAX_CAPACITY = parseInt(process.env.NEXT_PUBLIC_MAX_CAPACITY || '500');

if (!MP_PUBLIC_KEY || !MP_ACCESS_TOKEN) {
  console.warn('Missing Mercado Pago credentials in environment variables');
}

export const config = {
  mercadoPago: {
    publicKey: MP_PUBLIC_KEY,
    accessToken: MP_ACCESS_TOKEN,
    webhookSecret: MP_WEBHOOK_SECRET,
  },
  admin: {
    password: ADMIN_PASSWORD,
  },
  app: {
    maxCapacity: MAX_CAPACITY,
  },
};
