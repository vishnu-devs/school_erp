import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CreditCard, Landmark, CheckCircle2 } from 'lucide-react';
import ManualProofUploader from './ManualProofUploader';

const PaymentCheckout = ({ amount, description, onPaymentSuccess }) => {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const [transactionId, setTransactionId] = useState(null); // Simulated from backend

  const handleInitiate = (method) => {
    setSelectedMethod(method);
    setPaymentInitiated(true);
    
    // In production, this calls the backend to generate a `financial_transaction` 
    // and returns the `TXN-ID`
    setTransactionId('TXN-2026-SIMULATED-001');
    
    if (method === 'razorpay') {
      alert("Redirecting to Razorpay Checkout...");
      // Handle Razorpay SDK integration here
    }
  };

  const handleUploadComplete = () => {
    onPaymentSuccess && onPaymentSuccess();
  };

  if (paymentInitiated && selectedMethod === 'manual') {
    return (
      <div className="max-w-md mx-auto space-y-4">
        <Card className="bg-indigo-50 border-indigo-200">
          <CardContent className="p-6">
            <h3 className="font-bold text-indigo-900 text-lg mb-2">Manual Payment Instructions</h3>
            <p className="text-sm text-indigo-800 mb-4">Please transfer <strong>₹{amount}</strong> to the following UPI ID or scan the QR code.</p>
            
            <div className="bg-white p-4 rounded-md border border-indigo-100 text-center mb-4">
              <span className="block text-xs text-gray-500 uppercase tracking-wider">UPI ID</span>
              <span className="block font-mono text-lg font-bold text-gray-900">payments@erp</span>
            </div>
          </CardContent>
        </Card>

        <ManualProofUploader 
          transactionId={transactionId} 
          onUploadComplete={handleUploadComplete} 
        />
      </div>
    );
  }

  return (
    <Card className="max-w-md mx-auto border-gray-200">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">Complete Payment</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-black text-gray-900 mb-8 text-center">
          ₹{parseFloat(amount).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => handleInitiate('razorpay')}
            className="w-full flex items-center justify-between p-4 rounded-lg border-2 border-gray-200 hover:border-indigo-600 hover:bg-indigo-50 transition-all group"
          >
            <div className="flex items-center">
              <CreditCard className="w-6 h-6 text-indigo-600 mr-3" />
              <div className="text-left">
                <span className="block font-bold text-gray-900">Pay Online</span>
                <span className="block text-xs text-gray-500">Credit Card, Netbanking, UPI</span>
              </div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-transparent group-hover:text-indigo-600" />
          </button>

          <button 
            onClick={() => handleInitiate('manual')}
            className="w-full flex items-center justify-between p-4 rounded-lg border-2 border-gray-200 hover:border-emerald-600 hover:bg-emerald-50 transition-all group"
          >
            <div className="flex items-center">
              <Landmark className="w-6 h-6 text-emerald-600 mr-3" />
              <div className="text-left">
                <span className="block font-bold text-gray-900">Manual Transfer</span>
                <span className="block text-xs text-gray-500">Scan QR or Bank Transfer</span>
              </div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-transparent group-hover:text-emerald-600" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentCheckout;
