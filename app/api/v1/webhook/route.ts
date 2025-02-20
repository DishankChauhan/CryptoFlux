import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import crypto from 'crypto';
import { db, apiKeysCollection, webhooksCollection } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';

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
    const { url, events } = body;

    if (!url || !events || !Array.isArray(events) || events.length === 0) {
      return NextResponse.json(
        { error: 'Invalid webhook configuration' },
        { status: 400 }
      );
    }

    // Generate webhook secret
    const secret = crypto.randomBytes(32).toString('hex');

    // Create webhook
    const webhook = await addDoc(webhooksCollection, {
      user_id: keyData.user_id,
      url,
      events,
      secret,
      active: true,
      created_at: new Date().toISOString()
    });

    return NextResponse.json({
      id: webhook.id,
      url,
      events,
      secret
    });
  } catch (error) {
    console.error('Webhook creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}