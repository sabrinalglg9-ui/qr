import crypto from 'crypto';

interface MercadoPagoPreference {
  items: Array<{
    title: string;
    quantity: number;
    unit_price: number;
  }>;
  payer: {
    name: string;
    surname: string;
    email: string;
    phone: {
      number: string;
    };
  };
  notification_url: string;
  back_urls: {
    success: string;
    failure: string;
    pending: string;
  };
  auto_return: string;
  external_reference: string;
}

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
const MP_WEBHOOK_SECRET = process.env.MP_WEBHOOK_SECRET;

export const createPaymentPreference = async (
  data: any,
  amount: number,
  ticketPrice: number = 100
): Promise<{ id: string; initPoint: string }> => {
  try {
    const preference: MercadoPagoPreference = {
      items: [
        {
          title: 'Entrada',
          quantity: 1,
          unit_price: ticketPrice,
        },
      ],
      payer: {
        name: data.firstName,
        surname: data.lastName,
        email: data.email,
        phone: {
          number: data.phone,
        },
      },
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercado-pago`,
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL}/ticket`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL}/error`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/pendiente`,
      },
      auto_return: 'approved',
      external_reference: data.uuid,
    };

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(preference),
    });

    if (!response.ok) {
      throw new Error(`Mercado Pago API error: ${response.statusText}`);
    }

    const result = await response.json();
    return {
      id: result.id,
      initPoint: result.init_point,
    };
  } catch (error) {
    console.error('Error creating payment preference:', error);
    throw error;
  }
};

export const verifyWebhookSignature = (body: string, signature: string): boolean => {
  if (!MP_WEBHOOK_SECRET) return false;

  const hash = crypto
    .createHmac('sha256', MP_WEBHOOK_SECRET)
    .update(body)
    .digest('hex');

  return hash === signature;
};

export const getPaymentInfo = async (paymentId: string) => {
  try {
    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Mercado Pago API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting payment info:', error);
    throw error;
  }
};
