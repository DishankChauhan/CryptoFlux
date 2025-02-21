'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ethers } from 'ethers';
import { Loader2, ArrowLeft } from 'lucide-react';
import { formatEth, parseEth } from '@/lib/ethereum';

export default function SendPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [balance, setBalance] = useState('0');
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const [estimatedGas, setEstimatedGas] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        if (accounts[0]) {
          const balance = await provider.getBalance(accounts[0]);
          setBalance(balance.toString());
        }
      }
    };

    fetchBalance();
  }, []);

  const validateAddress = (address: string) => {
    try {
      return ethers.isAddress(address);
    } catch {
      return false;
    }
  };

  const handleAmountChange = (value: string) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      
      try {
        const amountWei = parseEth(value || '0');
        const balanceWei = parseEth(balance);
        if (amountWei > balanceWei) {
          toast({
            title: 'Invalid Amount',
            description: 'Amount exceeds available balance',
            variant: 'destructive',
          });
        }
      } catch (error) {
        // Handle parsing errors
      }
    }
  };

  const handleSend = async () => {
    try {
      if (!to || !amount) {
        throw new Error('Please fill in all fields');
      }

      if (!validateAddress(to)) {
        throw new Error('Invalid Ethereum address');
      }

      const amountWei = parseEth(amount);
      const balanceWei = parseEth(balance);
      if (amountWei > balanceWei) {
        throw new Error('Insufficient balance');
      }

      setProcessing(true);

      // Request account access
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Send transaction
      const tx = await signer.sendTransaction({
        to,
        value: parseEth(amount),
      });

      await tx.wait();

      toast({
        title: 'Success',
        description: 'Transaction sent successfully!',
      });

      router.push('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 bg-gray-800 border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            className="text-white hover:text-gray-200"
            onClick={() => router.push('/dashboard')}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
          <h2 className="text-2xl font-bold text-white">Send Payment</h2>
        </div>

        <div className="mb-6">
          <div className="p-4 rounded-lg bg-gray-700/50">
            <p className="text-sm text-gray-400">Available Balance</p>
            <p className="text-xl font-bold text-white">{formatEth(balance)} ETH</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="to">Recipient Address</Label>
            <Input
              id="to"
              placeholder="0x..."
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="bg-gray-700 border-gray-600"
              disabled={processing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (ETH)</Label>
            <Input
              id="amount"
              type="text"
              placeholder="0.0"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="bg-gray-700 border-gray-600"
              disabled={processing}
            />
          </div>

          <Button
            onClick={handleSend}
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={processing}
          >
            {processing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              'Send Payment'
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}