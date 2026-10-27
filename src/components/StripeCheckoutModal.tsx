import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, CreditCard, Lock, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';

export const StripeCheckoutModal: React.FC = () => {
  const { isStripeModalOpen, setIsStripeModalOpen, stripeModalData, completeStripePayment } = useApp();

  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('888');
  const [cardName, setCardName] = useState('Alex Rivers');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isStripeModalOpen || !stripeModalData) return null;

  const handleClose = () => {
    setIsStripeModalOpen(false);
    setIsProcessing(false);
    setIsSuccess(false);
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      completeStripePayment(stripeModalData.memberId, stripeModalData.amount);
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-[#ffffff] border border-[#dadce0] w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
        {/* Google Pay / Stripe Header */}
        <div className="p-5 bg-[#f8fafd] border-b border-[#e0e2ec] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1a73e8] flex items-center justify-center text-white font-bold text-sm shadow-xs">
              G
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-[#1f1f1f]">Google Pay · Stripe</span>
                <span className="text-[10px] font-mono text-[#1a73e8] bg-[#e8f0fe] px-2 py-0.2 rounded-full">
                  TIER 2
                </span>
              </div>
              <p className="text-[11px] text-[#5f6368]">TM Sports Club · USD / CAD</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-1 rounded-full text-[#747775] hover:bg-[#e0e2ec]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-[#c4eed0] text-[#137333] rounded-full flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-xl font-semibold text-[#1f1f1f]">
                  Payment Confirmed
                </h4>
                <p className="text-xs text-[#5f6368] mt-1">
                  Charged ${stripeModalData.amount.toFixed(2)} to Visa ending in 4242
                </p>
              </div>

              <div className="bg-[#f8fafd] p-4 rounded-2xl border border-[#e0e2ec] text-xs space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-[#5f6368]">Receipt ID:</span>
                  <span className="text-[#1f1f1f] font-mono">INV-TM-{Date.now().toString().slice(-6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5f6368]">Plan:</span>
                  <span className="text-[#1f1f1f] font-medium">{stripeModalData.description}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5f6368]">Pass Status:</span>
                  <span className="text-[#137333] font-bold uppercase">ACTIVE (Extended 30 Days)</span>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-2.5 px-4 text-xs font-medium text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-full transition-colors shadow-xs"
              >
                Return to Dashboard
              </button>
            </div>
          ) : (
            <form onSubmit={handlePay} className="space-y-4">
              <div className="p-4 bg-[#f8fafd] rounded-2xl border border-[#e0e2ec] flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#1f1f1f]">{stripeModalData.description}</div>
                  <div className="text-[11px] text-[#5f6368]">Monthly recurring athletic dues</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-normal text-[#1a73e8] font-mono">
                    ${stripeModalData.amount.toFixed(2)}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium uppercase text-[#444746] mb-1">
                  Card Information (Test Mode)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2 bg-[#ffffff] border border-[#dadce0] rounded-xl text-xs text-[#1f1f1f] focus:outline-none focus:border-[#1a73e8] font-mono"
                  />
                  <CreditCard className="w-4 h-4 text-[#5f6368] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium uppercase text-[#444746] mb-1">
                    Expires (MM/YY)
                  </label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-[#ffffff] border border-[#dadce0] rounded-xl text-xs text-[#1f1f1f] focus:outline-none focus:border-[#1a73e8] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium uppercase text-[#444746] mb-1">
                    CVC
                  </label>
                  <input
                    type="text"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-[#ffffff] border border-[#dadce0] rounded-xl text-xs text-[#1f1f1f] focus:outline-none focus:border-[#1a73e8] font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-[#5f6368]">
                <Lock className="w-3.5 h-3.5 text-[#5f6368]" />
                <span>Encrypted simulated checkout. No real card will be charged.</span>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 text-xs font-medium text-white bg-[#1a73e8] hover:bg-[#1557b0] disabled:bg-[#dadce0] rounded-full transition-colors shadow-xs"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing with Stripe...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Pay ${stripeModalData.amount.toFixed(2)}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
