'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { formatEth } from '@/lib/ethereum';
import { Loader2 } from 'lucide-react';

interface TransactionHistoryProps {
  userId: string;
}

export function TransactionHistory({ userId }: TransactionHistoryProps) {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const txQuery = query(
          collection(db, 'transactions'),
          where('merchant_id', '==', userId),
          orderBy('created_at', 'desc')
        );
        
        const snapshot = await getDocs(txQuery);
        setTransactions(snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })));
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <Card className="p-6 bg-gray-800 border-gray-700">
      <h2 className="text-xl font-semibold text-white mb-6">Transaction History</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-400 border-b border-gray-700">
              <th className="pb-4">Date</th>
              <th className="pb-4">Amount</th>
              <th className="pb-4">Status</th>
              <th className="pb-4">Transaction Hash</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-b border-gray-700">
                <td className="py-4">
                  {new Date(tx.created_at).toLocaleDateString()}
                </td>
                <td className="py-4">
                  {formatEth(tx.amount)} ETH
                </td>
                <td className="py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    tx.status === 'confirmed' 
                      ? 'bg-green-500/20 text-green-400'
                      : tx.status === 'failed'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {tx.status}
                  </span>
                </td>
                <td className="py-4">
                  <a
                    href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}