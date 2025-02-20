'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Send, Loader2 } from 'lucide-react';
import { parseEth, formatEth, createWallet, provider } from '@/lib/ethereum';
import { doc, updateDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ethers } from 'ethers';

interface SendPaymentModalProps {
  userId: string;
  userPrivateKey: string;
  balance: string;
}

export function SendPaymentModal({ userId, userPrivateKey, balance }: SendPaymentModalProps) {
  const [open, setOpen] = useState(false);
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [estimatedGas, setEstimatedGas] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { toast } = useToast();

  const validateAddress = (address: string) => {
    try {
      return ethers.isAddress(address);
    } catch {
      return false;
    }
  };

  const estimateGasPrice = async (to: string, amount: string) => {
    try {
      const wallet = createWallet(userPrivateKey);
      const gasPrice = await provider.getFeeData();
      const gasEstimate = await provider.estimateGas({
        from: wallet.address,
        to,
        value: parseEth(amount),
      });
      
      const totalGasCost = gasEstimate * gasPrice.gasPrice!;
      return formatEth(totalGasCost.toString());
    } catch (error) {
      console.error('Error estimating gas:', error);
      return null;
    }
  };

  const handleAmountChange = (value: string) => {
    // Only allow numbers and decimals
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      
      // Validate maximum amount
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

  const handlePrepareTransaction = async () => {
    try {
      // Basic validation
      if (!to || !amount) {
        throw new Error('Please fill in all fields');
      }

      // Validate address
      if (!validateAddress(to)) {
        throw new Error('Invalid Ethereum address');
      }

      // Validate amount
      const amountWei = parseEth(amount);
      const balanceWei = parseEth(balance);
      if (amountWei > balanceWei) {
        throw new Error('Insufficient balance');
      }

      // Estimate gas
      const estimatedGasCost = await estimateGasPrice(to, amount);
      if (estimatedGasCost) {
        setEstimatedGas(estimatedGasCost);
        setShowConfirmation(true);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleSend = async () => {
    try {
      setLoading(true);

      // Create wallet instance
      const wallet = createWallet(userPrivateKey);

      // Create transaction
      const tx = await wallet.sendTransaction({
        to,
        value: parseEth(amount),
      });

      // Add transaction to Firestore
      const txDoc = await addDoc(collection(db, 'transactions'), {
        userId,
        hash: tx.hash,
        from: wallet.address,
        to,
        amount: parseEth(amount).toString(),
        status: 'pending',
        timestamp: new Date().toISOString(),
      });

      // Update user's balance
      const newBalance = parseEth(balance) - parseEth(amount);
      await updateDoc(doc(db, 'users', userId), {
        balance: newBalance.toString(),
      });

      toast({
        title: 'Transaction Sent',
        description: 'Your transaction has been submitted to the network.',
      });

      setOpen(false);
      setTo('');
      setAmount('');
      setShowConfirmation(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Send className="h-5 w-5 mr-2" />
          Send Payment
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-800 text-white">
        {!showConfirmation ? (
          <>
            <DialogHeader>
              <DialogTitle>Send Payment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="to">Recipient Address</Label>
                <Input
                  id="to"
                  placeholder="0x..."
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="bg-gray-700 border-gray-600"
                  disabled={loading}
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
                  disabled={loading}
                />
              </div>
              <Button
                onClick={handlePrepareTransaction}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Preparing...
                  </>
                ) : (
                  'Continue'
                )}
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Confirm Transaction</DialogTitle>
              <DialogDescription className="text-gray-400">
                Please review the transaction details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">To</p>
                <p className="text-sm font-mono">{to}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Amount</p>
                <p className="text-lg font-bold">{amount} ETH</p>
              </div>
              {estimatedGas && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">Estimated Gas Fee</p>
                  <p className="text-sm">{estimatedGas} ETH</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowConfirmation(false)}
                className="border-gray-600"
                disabled={loading}
              >
                Back
              </Button>
              <Button
                onClick={handleSend}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Confirm & Send'
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}