'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { addDoc, getDocs, query, where, collection } from 'firebase/firestore';
import { db, apiKeysCollection } from '@/lib/firebase';
import { v4 as uuidv4 } from 'uuid';
import { Loader2, Copy, Key } from 'lucide-react';

interface ApiKeyManagerProps {
  userId: string;
}

export function ApiKeyManager({ userId }: ApiKeyManagerProps) {
  const [loading, setLoading] = useState(false);
  const [keyName, setKeyName] = useState('');
  const { toast } = useToast();

  const generateApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a name for your API key',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const apiKey = `pk_${uuidv4().replace(/-/g, '')}`;
      
      await addDoc(apiKeysCollection, {
        user_id: userId,
        key: apiKey,
        name: keyName,
        active: true,
        created_at: new Date().toISOString(),
      });

      toast({
        title: 'Success',
        description: 'API key created successfully',
      });

      // Copy to clipboard
      await navigator.clipboard.writeText(apiKey);
      toast({
        title: 'Copied!',
        description: 'API key copied to clipboard',
      });

      setKeyName('');
    } catch (error) {
      console.error('Error generating API key:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate API key',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-gray-800 border-gray-700">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">API Keys</h2>
        <p className="text-gray-400">
          Generate API keys to integrate CryptoGate with your application.
        </p>
      </div>

      <form onSubmit={generateApiKey} className="space-y-4">
        <div>
          <Input
            type="text"
            placeholder="API Key Name"
            value={keyName}
            onChange={(e) => setKeyName(e.target.value)}
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
              Generating...
            </>
          ) : (
            <>
              <Key className="h-4 w-4 mr-2" />
              Generate API Key
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}