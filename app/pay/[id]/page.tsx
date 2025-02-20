'use client';

/// <reference types="react-scripts" />
import { useEffect, useState } from 'react';

declare global {
  interface Window {
    ethereum: any;
  }
}
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db, paymentRequestsCollection } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ethers } from 'ethers';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentRequest {
  id: string;
  amount: string;
  currency: string;
  merchant_id: string;
  status: string;
  success_url?: string;
  cancel_url?: string;
}

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [payment, setPayment] = useState<PaymentRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const paymentDoc = await getDoc(doc(db, 'payment_requests', params.id as string));
        if (paymentDoc.exists()) {
          setPayment(paymentDoc.data() as PaymentRequest);
        } else {
          toast({
            title: 'Error',
            description: 'Payment request not found',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error fetching payment:', error);
        toast({
          title: 'Error',
          description: 'Failed to load payment details',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [params.id]);

  const handlePayment = async () => {
    if (!payment) return;

    setProcessing(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();

      // Send transaction
      const tx = await signer.sendTransaction({
        to: payment.merchant_id,
        value: ethers.parseEther(payment.amount),
      });

      await tx.wait();

      toast({
        title: 'Success',
        description: 'Payment completed successfully',
      });

      if (payment.success_url) {
        window.location.href = payment.success_url;
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Payment failed',
        variant: 'destructive',
      });

      if (payment.cancel_url) {
        window.location.href = payment.cancel_url;
      }
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <Card className="p-6 bg-gray-800 border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Payment Not Found</h2>
          <p className="text-gray-400">This payment request does not exist or has expired.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 bg-gray-800 border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6">Complete Payment</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Amount:</span>
            <span className="text-xl font-bold text-white">{payment.amount} {payment.currency}</span>
          </div>
          <Button
            onClick={handlePayment}
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={processing}
          >
            {processing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Pay Now'
            )}
          </Button>
          {payment.cancel_url && (
            <Button
              variant="ghost"
              className="w-full text-gray-400 hover:text-gray-300"
              onClick={() => window.location.href = payment.cancel_url!}
              disabled={processing}
            >
              Cancel
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}