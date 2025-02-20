import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { db, apiKeysCollection, paymentRequestsCollection } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const headersList = headers();
    const apiKey = headersList.get('x-api-key');

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 401 }
      );
    }

    // Verify API key
    const apiKeyQuery = query(apiKeysCollection, where('key', '==', apiKey), where('active', '==', true));
    const apiKeySnapshot = await getDocs(apiKeyQuery);

    if (apiKeySnapshot.empty) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    const keyData = apiKeySnapshot.docs[0].data();
    const body = await req.json();
    const {
      amount,
      currency = 'ETH',
      callback_url,
      success_url,
      cancel_url,
      metadata = {}
    } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Create payment request
    const paymentId = uuidv4();
    const payment = {
      id: paymentId,
      merchant_id: keyData.user_id,
      amount,
      currency,
      callback_url,
      success_url,
      cancel_url,
      metadata,
      status: 'pending',
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes expiry
    };

    await addDoc(paymentRequestsCollection, payment);

    const paymentUrl = `${process.env.NEXT_PUBLIC_APP_URL}/pay/${paymentId}`;

    return NextResponse.json({
      id: paymentId,
      amount,
      currency,
      status: payment.status,
      payment_url: paymentUrl,
      expires_at: payment.expires_at
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}