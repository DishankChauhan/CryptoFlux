'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { formatEth } from '@/lib/ethereum';
import { Loader2 } from 'lucide-react';

interface AnalyticsProps {
  userId: string;
}

export function Analytics({ userId }: AnalyticsProps) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalVolume: '0',
    successRate: 0,
    averageAmount: '0',
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const txQuery = query(
          collection(db, 'transactions'),
          where('merchant_id', '==', userId)
        );
        
        const snapshot = await getDocs(txQuery);
        const transactions = snapshot.docs.map(doc => doc.data());
        
        const total = transactions.length;
        const successful = transactions.filter(tx => tx.status === 'confirmed').length;
        const volume = transactions.reduce((sum, tx) => sum + Number(tx.amount), 0);
        
        setStats({
          totalTransactions: total,
          totalVolume: volume.toString(),
          successRate: total > 0 ? (successful / total) * 100 : 0,
          averageAmount: total > 0 ? (volume / total).toString() : '0',
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="p-6 bg-gray-800 border-gray-700">
        <h3 className="text-sm font-medium text-gray-400">Total Transactions</h3>
        <p className="text-2xl font-bold text-white mt-2">
          {stats.totalTransactions}
        </p>
      </Card>
      
      <Card className="p-6 bg-gray-800 border-gray-700">
        <h3 className="text-sm font-medium text-gray-400">Total Volume</h3>
        <p className="text-2xl font-bold text-white mt-2">
          {formatEth(stats.totalVolume)} ETH
        </p>
      </Card>
      
      <Card className="p-6 bg-gray-800 border-gray-700">
        <h3 className="text-sm font-medium text-gray-400">Success Rate</h3>
        <p className="text-2xl font-bold text-white mt-2">
          {stats.successRate.toFixed(1)}%
        </p>
      </Card>
      
      <Card className="p-6 bg-gray-800 border-gray-700">
        <h3 className="text-sm font-medium text-gray-400">Average Amount</h3>
        <p className="text-2xl font-bold text-white mt-2">
          {formatEth(stats.averageAmount)} ETH
        </p>
      </Card>
    </div>
  );
}