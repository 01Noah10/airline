import React, { useState } from 'react';
import { useBooking } from './Root';
import { useNavigate } from 'react-router';
import { CreditCard, Lock, Info, ChevronLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';

export function Payment() {
  const { state, updateState } = useBooking();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Please enter cardholder name';
    if (!formData.email) newErrors.email = 'Please enter email address';
    if (!formData.cardNumber) newErrors.cardNumber = 'Please enter card number';
    if (!formData.expiry) newErrors.expiry = 'Required';
    if (!formData.cvc) newErrors.cvc = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsProcessing(true);
      setTimeout(() => {
        navigate('/confirmation');
      }, 2000);
    }
  };

  return (
    <div className="space-y-10 pb-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-neutral-900">Secure Checkout</h2>
        <p className="text-neutral-500 font-medium">Verify your details and complete the booking securely.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Contact Details */}
          <div className="bg-white border border-neutral-200 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">1</span>
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-500 uppercase">Passenger Email</label>
                <input
                  type="email"
                  placeholder="name@email.com"
                  className={clsx(
                    "w-full h-12 px-4 rounded-xl bg-neutral-50 border transition-all focus:ring-2 focus:ring-blue-500 outline-none",
                    errors.email ? "border-red-500" : "border-neutral-200"
                  )}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                {errors.email && <span className="text-[10px] text-red-500 font-bold uppercase">{errors.email}</span>}
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white border border-neutral-200 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">2</span>
              Payment Method
            </h3>
            
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="text-blue-600" />
                  <span className="font-bold text-blue-900">Credit or Debit Card</span>
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-5 bg-neutral-200 rounded" />
                  <div className="w-8 h-5 bg-neutral-200 rounded" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-500 uppercase">Cardholder Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className={clsx(
                      "w-full h-12 px-4 rounded-xl bg-neutral-50 border transition-all focus:ring-2 focus:ring-blue-500 outline-none",
                      errors.name ? "border-red-500" : "border-neutral-200"
                    )}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  {errors.name && <span className="text-[10px] text-red-500 font-bold uppercase">{errors.name}</span>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-500 uppercase">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="XXXX XXXX XXXX XXXX"
                      className={clsx(
                        "w-full h-12 px-4 rounded-xl bg-neutral-50 border transition-all focus:ring-2 focus:ring-blue-500 outline-none",
                        errors.cardNumber ? "border-red-500" : "border-neutral-200"
                      )}
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                    />
                    <Lock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-300" />
                  </div>
                  {errors.cardNumber && <span className="text-[10px] text-red-500 font-bold uppercase">{errors.cardNumber}</span>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-500 uppercase">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className={clsx(
                        "w-full h-12 px-4 rounded-xl bg-neutral-50 border transition-all focus:ring-2 focus:ring-blue-500 outline-none",
                        errors.expiry ? "border-red-500" : "border-neutral-200"
                      )}
                      value={formData.expiry}
                      onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                    />
                    {errors.expiry && <span className="text-[10px] text-red-500 font-bold uppercase">{errors.expiry}</span>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-500 uppercase">CVC Code</label>
                    <input
                      type="password"
                      placeholder="123"
                      className={clsx(
                        "w-full h-12 px-4 rounded-xl bg-neutral-50 border transition-all focus:ring-2 focus:ring-blue-500 outline-none",
                        errors.cvc ? "border-red-500" : "border-neutral-200"
                      )}
                      value={formData.cvc}
                      onChange={(e) => setFormData({ ...formData, cvc: e.target.value })}
                    />
                    {errors.cvc && <span className="text-[10px] text-red-500 font-bold uppercase">{errors.cvc}</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-neutral-900 text-white rounded-3xl p-8 shadow-2xl">
            <h3 className="text-xl font-bold mb-6">Final Confirmation</h3>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-neutral-400 text-sm">
                <CheckCircle2 size={16} className="text-blue-400" />
                <span>Selected flight confirmed</span>
              </div>
              <div className="flex items-center gap-3 text-neutral-400 text-sm">
                <CheckCircle2 size={16} className="text-blue-400" />
                <span>No hidden fees applied</span>
              </div>
              <div className="flex items-center gap-3 text-neutral-400 text-sm">
                <CheckCircle2 size={16} className="text-blue-400" />
                <span>Instant ticket delivery</span>
              </div>
            </div>
            
            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className={clsx(
                "w-full py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3",
                isProcessing ? "bg-neutral-700 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/40"
              )}
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ShieldCheck size={20} />
                  Book & Pay Now
                </>
              )}
            </button>
            <p className="text-[10px] text-neutral-500 text-center mt-6 font-medium leading-relaxed">
              By clicking "Book & Pay Now", you agree to our terms and conditions. Your payment is protected by 256-bit SSL encryption.
            </p>
          </div>

          <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-start gap-4">
            <Info className="text-orange-500 shrink-0" size={20} />
            <p className="text-xs text-orange-700 leading-tight">
              Please double check your email address. Your e-ticket will be sent immediately after successful payment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
