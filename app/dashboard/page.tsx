'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatEth } from '@/lib/ethereum';
import { signOut } from '@/lib/auth';
import { SendPaymentModal } from '@/components/SendPaymentModal';
import { ApiKeyManager } from '@/components/ApiKeyManager';
import { WebhookManager } from '@/components/WebhookManager';
import { TransactionHistory } from '@/components/TransactionHistory';
import { Analytics } from '@/components/Analytics';
import { Wallet, History, LogOut, Key, Webhook, ChartBar } from 'lucide-react';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <Wallet className="h-8 w-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-white">Merchant Dashboard</h1>
          </div>
          <Button
            variant="ghost"
            className="text-white hover:text-gray-200"
            onClick={() => signOut()}
          >
            <LogOut className="h-5 w-5 mr-2" />
            Sign Out
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="overview" className="text-white">
              <ChartBar className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="transactions" className="text-white">
              <History className="h-4 w-4 mr-2" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="api-keys" className="text-white">
              <Key className="h-4 w-4 mr-2" />
              API Keys
            </TabsTrigger>
            <TabsTrigger value="webhooks" className="text-white">
              <Webhook className="h-4 w-4 mr-2" />
              Webhooks
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Analytics userId={user.uid} />
          </TabsContent>

          <TabsContent value="transactions">
            <TransactionHistory userId={user.uid} />
          </TabsContent>

          <TabsContent value="api-keys">
            <ApiKeyManager userId={user.uid} />
          </TabsContent>

          <TabsContent value="webhooks">
            <WebhookManager userId={user.uid} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}