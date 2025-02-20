'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { addDoc, collection } from 'firebase/firestore';
import { db, webhooksCollection } from '@/lib/firebase';
import { Loader2, Webhook } from 'lucide-react';

interface WebhookManagerProps {
  userId: string;
}

export function WebhookManager({ userId }: WebhookManagerProps) {
  const [loading, setLoading] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!webhookUrl.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a webhook URL',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      await addDoc(webhooksCollection, {
        user_id: userId,
        url: webhookUrl,
        events: ['payment.success', 'payment.failed', 'payment.pending'],
        active: true,
        created_at: new Date().toISOString(),
      });

      toast({
        title: 'Success',
        description: 'Webhook endpoint configured successfully',
      });

      setWebhookUrl('');
    } catch (error) {
      console.error('Error configuring webhook:', error);
      toast({
        title: 'Error',
        description: 'Failed to configure webhook',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-gray-800 border-gray-700">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">Webhook Configuration</h2>
        <p className="text-gray-400">
          Configure webhook endpoints to receive real-time payment updates.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="url"
            placeholder="https://your-site.com/webhook"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            className="bg-gray-700 text-white border-gray-600"
            disabled={loading}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Configuring...
            </>
          ) : (
            <>
              <Webhook className="h-4 w-4 mr-2" />
              Configure Webhook
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}