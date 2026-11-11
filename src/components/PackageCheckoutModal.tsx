import React, { useState, useEffect } from 'react';
import {
  CustomerProfile,
  SelectedPackage,
  OrderRecord,
  createServerOrder,
  verifyServerPayment,
  fetchGatewayConfig,
  GatewayConfig,
  saveCustomer
} from '../services/checkoutService';
import { FoodblizFloralBadge } from './FoodblizFloralBadge';

interface PackageCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage: SelectedPackage | null;
  customer: CustomerProfile | null;
  onLoginSuccess: (customer: CustomerProfile) => void;
  onOrderSuccess: (order: OrderRecord) => void;
  onOpenPurchases: () => void;
  onExploreFood: () => void;
}

type CheckoutStep = 'auth' | 'confirm' | 'payment' | 'success';

export const PackageCheckoutModal: React.FC<PackageCheckoutModalProps> = ({
  isOpen,
  onClose,
  selectedPackage,
  customer,
  onLoginSuccess,
  onOrderSuccess,
  onOpenPurchases,
  onExploreFood
}) => {
  // Step state: if customer is logged in, jump to 'confirm', otherwise 'auth'
  const [step, setStep] = useState<CheckoutStep>('confirm');

  // Auth tab: 'create' or 'login'
  const [authTab, setAuthTab] = useState<'create' | 'login'>('create');
  const [authForm, setAuthForm] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: ''
  });
  const [authError, setAuthError] = useState<string | null>(null);

  // Active Order state
  const [currentOrder, setCurrentOrder] = useState<OrderRecord | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'wallets'>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [selectedWallet, setSelectedWallet] = useState('Paytm');

  // Payment execution state
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [pendingNotice, setPendingNotice] = useState<string | null>(null);
  const [testOutcome, setTestOutcome] = useState<'success' | 'failure' | 'cancelled' | 'pending'>('success');

  // Gateway config
  const [gatewayConfig, setGatewayConfig] = useState<GatewayConfig | null>(null);

  // Reset or initialize step whenever modal opens or package/customer changes
  useEffect(() => {
    if (isOpen) {
      fetchGatewayConfig().then(setGatewayConfig);

      if (customer && customer.isLoggedIn) {
        setStep('confirm');
      } else {
        setStep('auth');
      }
      setPaymentError(null);
      setPendingNotice(null);
    }
  }, [isOpen, customer]);

  if (!isOpen || !selectedPackage) return null;

  // ----------------------------------------------------
  // Handlers for Authentication
  // ----------------------------------------------------
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (authTab === 'create') {
      if (!authForm.fullName.trim()) {
        setAuthError('Please enter your full name.');
        return;
      }
      if (!authForm.email.trim() || !authForm.email.includes('@')) {
        setAuthError('Please enter a valid email address.');
        return;
      }
      if (!authForm.mobile.trim() || authForm.mobile.replace(/\D/g, '').length < 10) {
        setAuthError('Please enter a valid 10-digit mobile number.');
        return;
      }
      if (!authForm.password || authForm.password.length < 6) {
        setAuthError('Password must be at least 6 characters.');
        return;
      }

      const newCustomer: CustomerProfile = {
        fullName: authForm.fullName.trim(),
        email: authForm.email.trim().toLowerCase(),
        mobile: authForm.mobile.startsWith('+91')
          ? authForm.mobile.trim()
          : `+91 ${authForm.mobile.trim()}`,
        isLoggedIn: true
      };

      saveCustomer(newCustomer);
      onLoginSuccess(newCustomer);
      setStep('confirm');
    } else {
      // Login mode
      if (!authForm.email.trim()) {
        setAuthError('Please enter your registered email address or mobile.');
        return;
      }
      if (!authForm.password) {
        setAuthError('Please enter your password.');
        return;
      }

      const loggedCustomer: CustomerProfile = {
        fullName: authForm.fullName.trim() || 'Foodbliz Member',
        email: authForm.email.trim().toLowerCase(),
        mobile: authForm.mobile || '+91 9876543210',
        isLoggedIn: true
      };

      saveCustomer(loggedCustomer);
      onLoginSuccess(loggedCustomer);
      setStep('confirm');
    }
  };

  // ----------------------------------------------------
  // Handlers for Order Confirmation -> Proceed to Pay
  // ----------------------------------------------------
  const handleProceedToPayment = async () => {
    if (!customer) {
      setStep('auth');
      return;
    }

    setIsCreatingOrder(true);
    setPaymentError(null);

    try {
      const idempotencyKey = `idemp_${customer.email}_${selectedPackage.id}_${Date.now()}`;
      const { order } = await createServerOrder(selectedPackage, customer, idempotencyKey);
      setCurrentOrder(order);
      setStep('payment');
    } catch (err) {
      console.error('Failed to create order:', err);
      setPaymentError('Could not initialize order with server. Please try again.');
    } finally {
      setIsCreatingOrder(false);
    }
  };

  // ----------------------------------------------------
  // Handlers for Payment Execution & Verification
  // ----------------------------------------------------
  const handleExecutePayment = async () => {
    if (!currentOrder) return;

    setIsProcessingPayment(true);
    setPaymentError(null);
    setPendingNotice(null);

    // Simulate secure network handoff and server verification
    setTimeout(async () => {
      try {
        let paymentMethodLabel = 'UPI';
        if (paymentMethod === 'card') {
          paymentMethodLabel = `Card (•••• ${cardDetails.number.slice(-4) || '4242'})`;
        } else if (paymentMethod === 'netbanking') {
          paymentMethodLabel = `Net Banking (${selectedBank})`;
        } else if (paymentMethod === 'wallets') {
          paymentMethodLabel = `Wallet (${selectedWallet})`;
        } else {
          paymentMethodLabel = upiId ? `UPI (${upiId})` : 'UPI (Fast Checkout)';
        }

        const result = await verifyServerPayment(
          currentOrder.orderId,
          paymentMethodLabel,
          testOutcome,
          testOutcome === 'failure' ? 'Card declined: Insufficient funds or bank server error.' : undefined
        );

        if (result.verified && result.status === 'paid') {
          setCurrentOrder(result.order);
          onOrderSuccess(result.order);
          setStep('success');
        } else if (result.status === 'pending') {
          setCurrentOrder(result.order);
          setPendingNotice(
            'Payment is pending bank verification. We have registered your transaction and will update the status once confirmed.'
          );
        } else if (result.status === 'cancelled') {
          setPaymentError('Payment was cancelled by user. You can retry anytime.');
        } else {
          setPaymentError(result.error || 'Payment failed. Please check your payment details or try another method.');
        }
      } catch (err: any) {
        setPaymentError(err.message || 'Payment verification encountered an unexpected error.');
      } finally {
        setIsProcessingPayment(false);
      }
    }, 1100);
  };

  // Format included features string (e.g., "25 Images · 2 Banners · 1 Video")
  const includedFeaturesText = selectedPackage.features
    .filter((f) => !f.disabled)
    .map((f) => f.text.replace(' / Month', ''))
    .join(' · ');

  return (
    <div
      aria-hidden="false"
      data-modal-overlay="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 bg-black/65 backdrop-blur-xs transition-opacity duration-200 overscroll-contain overflow-y-auto"
      id="package-checkout-modal"
    >
      <div
        data-modal-scroll-container="true"
        className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 overflow-hidden my-auto transform transition-transform duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header with Foodbliz branding & step indicator */}
        <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-xl font-black tracking-tight text-gray-900">
              Food<span className="text-[#E50914]">bliz</span>
            </span>
            <span className="text-gray-300">|</span>
            <span className="text-xs sm:text-sm font-bold text-gray-700">
              Buy Package – User Flow
            </span>
          </div>

          <button
            type="button"
            aria-label="Close checkout"
            onClick={onClose}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-black flex items-center justify-center transition-colors cursor-pointer focus:outline-none"
          >
            <svg className="w-4 h-4 stroke-current fill-none stroke-[2.5]" viewBox="0 0 24 24">
              <line x1="18" x2="6" y1="6" y2="18" />
              <line x1="6" x2="18" y1="6" y2="18" />
            </svg>
          </button>
        </div>

        {/* Top Breadcrumb / Step Indicator matching reference */}
        <div className="bg-gray-50/80 border-b border-gray-200/80 px-3 sm:px-6 py-2.5 sm:py-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-between min-w-[340px] text-[10px] sm:text-xs">
            {/* Step 1 */}
            <div className="flex items-center gap-1 sm:gap-1.5 opacity-60">
              <span className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-gray-200 text-gray-700 font-bold flex items-center justify-center text-[10px]">
                1
              </span>
              <span className="font-semibold text-gray-700">Select</span>
            </div>

            <span className="text-gray-300">→</span>

            {/* Step 2 */}
            <div
              className={`flex items-center gap-1 sm:gap-1.5 ${
                step === 'auth' ? 'text-[#E50914] font-bold' : 'opacity-70'
              }`}
            >
              <span
                className={`w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full font-bold flex items-center justify-center text-[10px] ${
                  step === 'auth'
                    ? 'bg-[#E50914] text-white shadow-xs'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                2
              </span>
              <span>Account</span>
            </div>

            <span className="text-gray-300">→</span>

            {/* Step 3 */}
            <div
              className={`flex items-center gap-1 sm:gap-1.5 ${
                step === 'confirm' ? 'text-[#E50914] font-bold' : 'opacity-70'
              }`}
            >
              <span
                className={`w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full font-bold flex items-center justify-center text-[10px] ${
                  step === 'confirm'
                    ? 'bg-[#E50914] text-white shadow-xs'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                3
              </span>
              <span>Confirm</span>
            </div>

            <span className="text-gray-300">→</span>

            {/* Step 4 */}
            <div
              className={`flex items-center gap-1 sm:gap-1.5 ${
                step === 'payment' ? 'text-[#E50914] font-bold' : 'opacity-70'
              }`}
            >
              <span
                className={`w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full font-bold flex items-center justify-center text-[10px] ${
                  step === 'payment'
                    ? 'bg-[#E50914] text-white shadow-xs'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                4
              </span>
              <span>Payment</span>
            </div>

            <span className="text-gray-300">→</span>

            {/* Step 5 */}
            <div
              className={`flex items-center gap-1 sm:gap-1.5 ${
                step === 'success' ? 'text-[#E50914] font-bold' : 'opacity-70'
              }`}
            >
              <span
                className={`w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full font-bold flex items-center justify-center text-[10px] ${
                  step === 'success'
                    ? 'bg-[#E50914] text-white shadow-xs'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                5
              </span>
              <span>Complete</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 md:p-7 max-h-[76vh] overflow-y-auto">
          {/* ========================================================= */}
          {/* STEP 2: CREATE / CONTINUE ACCOUNT                          */}
          {/* ========================================================= */}
          {step === 'auth' && (
            <div className="flex flex-col items-center text-center">
              <h2 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
                Continue to Purchase
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5 mb-5">
                Enter your details to get started
              </p>

              {/* Toggle: Create Account / Login */}
              <div className="flex items-center p-1 bg-gray-100 rounded-xl mb-5 w-full max-w-sm">
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab('create');
                    setAuthError(null);
                  }}
                  className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                    authTab === 'create'
                      ? 'bg-white text-[#E50914] shadow-xs border border-gray-200'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Create Account
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab('login');
                    setAuthError(null);
                  }}
                  className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                    authTab === 'login'
                      ? 'bg-white text-[#E50914] shadow-xs border border-gray-200'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Login
                </button>
              </div>

              {authError && (
                <div className="w-full max-w-sm mb-3.5 p-2.5 bg-red-50 border border-red-200 text-[#E50914] rounded-xl text-xs font-semibold text-left">
                  {authError}
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="w-full max-w-sm space-y-3 text-left">
                {authTab === 'create' && (
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </span>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={authForm.fullName}
                        onChange={(e) => setAuthForm({ ...authForm, fullName: e.target.value })}
                        className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#E50914] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    {authTab === 'create' ? 'Email Address' : 'Email or Mobile'}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </span>
                    <input
                      type={authTab === 'create' ? 'email' : 'text'}
                      required
                      placeholder={authTab === 'create' ? 'name@restaurant.com' : 'Enter email or phone'}
                      value={authForm.email}
                      onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#E50914] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {authTab === 'create' && (
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Mobile Number
                    </label>
                    <div className="relative flex">
                      <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-100 text-gray-600 text-xs font-bold">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        placeholder="98765 43210"
                        value={authForm.mobile}
                        onChange={(e) => setAuthForm({ ...authForm, mobile: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-r-xl text-sm focus:bg-white focus:border-[#E50914] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    {authTab === 'create' ? 'Create Password' : 'Password'}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={authForm.password}
                      onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#E50914] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#E50914] hover:bg-[#c81e24] text-white font-extrabold text-sm uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer focus:outline-none"
                  >
                    Continue
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 3: CONFIRM YOUR PACKAGE                              */}
          {/* ========================================================= */}
          {step === 'confirm' && (
            <div className="flex flex-col items-center">
              <h2 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight text-center mb-4">
                Confirm Your Package
              </h2>

              {/* Package Card Preview matching reference */}
              <div className="w-full bg-[#FFF9F9] border-2 border-[#E50914] rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 sm:gap-4 shadow-xs mb-5">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-orange-100 overflow-hidden shrink-0 border border-orange-200 flex items-center justify-center p-1">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlt-GPML9IDb7t0dgQGs7eipLliajlQXkb_OWHOrOLBHGNm61w6CLWM4DG3auLAMP_krnuIDnn3OyD5S0vpEg-YeveqkeZKdJOPaeVsktUUVHlmyOueA0asm8ngwsDSZ_OIaXpvvF1kJW9b-yVoNizbZadjyvgAl97tN4fLPv-clCdfd1YlShQhTWfhDtejyxtcbEzq12WnRFkkaSNwQctbNLWlLDKAZiydv-vxoaN-zSXgZGOW2J8Cnl9Qkrm2IJREw"
                    alt="Food dish"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base sm:text-lg font-black text-gray-900 truncate">
                      {selectedPackage.name}
                    </h3>
                    {selectedPackage.badge && (
                      <span className="text-[10px] font-bold text-[#E50914] bg-white border border-red-200 px-1.5 py-0.5 rounded-md">
                        ★ {selectedPackage.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5 font-medium truncate">
                    {includedFeaturesText}
                  </p>
                  <p className="text-xs sm:text-sm font-black text-[#E50914] mt-1">
                    ₹{selectedPackage.price}{' '}
                    <span className="text-[11px] font-normal text-gray-600">
                      ({selectedPackage.type === 'subscription' ? 'Monthly Subscription' : 'One-Time Purchase'})
                    </span>
                  </p>
                </div>
              </div>

              {/* Order Summary Table */}
              <div className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 sm:p-5 mb-5 space-y-2.5 text-xs sm:text-sm">
                <div className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Order Summary
                </div>
                <div className="flex items-center justify-between text-gray-700">
                  <span>Package Price</span>
                  <span className="font-bold text-gray-900">₹{selectedPackage.price}</span>
                </div>
                <div className="flex items-center justify-between text-gray-700">
                  <span>GST & Digital Processing</span>
                  <span className="font-semibold text-emerald-600">₹0 (Included)</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex items-center justify-between">
                  <span className="font-bold text-gray-900 text-sm sm:text-base">Total Payable</span>
                  <span className="font-black text-[#E50914] text-lg sm:text-xl">
                    ₹{selectedPackage.price}
                  </span>
                </div>
              </div>

              {/* Customer Account Details Review */}
              {customer && (
                <div className="w-full bg-white border border-gray-200 rounded-xl p-3.5 mb-5 flex items-center justify-between text-xs">
                  <div className="min-w-0">
                    <span className="text-gray-500 font-semibold block">Purchasing as:</span>
                    <span className="font-bold text-gray-900 block truncate">
                      {customer.fullName} ({customer.email})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep('auth')}
                    className="text-[#E50914] font-bold hover:underline cursor-pointer ml-3 shrink-0"
                  >
                    Change
                  </button>
                </div>
              )}

              {paymentError && (
                <div className="w-full mb-4 p-2.5 bg-red-50 border border-red-200 text-[#E50914] rounded-xl text-xs font-semibold">
                  {paymentError}
                </div>
              )}

              <button
                type="button"
                disabled={isCreatingOrder}
                onClick={handleProceedToPayment}
                className="w-full py-3.5 bg-[#E50914] hover:bg-[#c81e24] disabled:opacity-60 text-white font-extrabold text-sm uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer focus:outline-none flex items-center justify-center gap-2"
              >
                {isCreatingOrder ? (
                  <>
                    <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Initializing Order...
                  </>
                ) : (
                  'Proceed to Pay'
                )}
              </button>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 4: PAY SECURELY                                      */}
          {/* ========================================================= */}
          {step === 'payment' && (
            <div className="flex flex-col items-center">
              <h2 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight text-center">
                Pay Securely
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5 mb-4 text-center">
                Choose your preferred payment method
              </p>

              {/* Gateway Configuration & Status Notice */}
              {gatewayConfig && (
                <div
                  className={`w-full mb-4 p-3 rounded-xl border text-xs ${
                    gatewayConfig.isLiveConfigured
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-amber-50 border-amber-200 text-amber-900'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold mb-0.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        gatewayConfig.isLiveConfigured ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                    />
                    <span>
                      {gatewayConfig.isLiveConfigured
                        ? 'Production Gateway Connected'
                        : 'Sandbox / Testing Environment Active'}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-amber-800/90">
                    {gatewayConfig.notice}
                  </p>
                </div>
              )}

              {/* Test Outcomes Selector for Verification Testing (Per Spec requirement 4 & 9) */}
              <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 mb-4">
                <div className="flex items-center justify-between text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">
                  <span>Scenario Simulation</span>
                  <span className="text-[10px] lowercase font-normal text-gray-500">
                    (test edge cases)
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setTestOutcome('success')}
                    className={`py-1.5 px-2 rounded-lg font-bold transition-all text-center cursor-pointer ${
                      testOutcome === 'success'
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Success
                  </button>
                  <button
                    type="button"
                    onClick={() => setTestOutcome('failure')}
                    className={`py-1.5 px-2 rounded-lg font-bold transition-all text-center cursor-pointer ${
                      testOutcome === 'failure'
                        ? 'bg-red-600 text-white shadow-2xs'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Failure
                  </button>
                  <button
                    type="button"
                    onClick={() => setTestOutcome('cancelled')}
                    className={`py-1.5 px-2 rounded-lg font-bold transition-all text-center cursor-pointer ${
                      testOutcome === 'cancelled'
                        ? 'bg-gray-800 text-white shadow-2xs'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setTestOutcome('pending')}
                    className={`py-1.5 px-2 rounded-lg font-bold transition-all text-center cursor-pointer ${
                      testOutcome === 'pending'
                        ? 'bg-amber-600 text-white shadow-2xs'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Pending
                  </button>
                </div>
              </div>

              {/* Payment Methods List matching reference */}
              <div className="w-full space-y-2.5 mb-5">
                {/* Method 1: UPI */}
                <label
                  onClick={() => setPaymentMethod('upi')}
                  className={`w-full p-3 sm:p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-[#E50914] bg-[#FFF9F9] shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        paymentMethod === 'upi'
                          ? 'border-[#E50914] bg-[#E50914]'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {paymentMethod === 'upi' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>
                    <span className="font-bold text-gray-900 text-sm">UPI</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-black tracking-tight text-gray-800 bg-gray-100 px-2 py-0.5 rounded">
                      UPI / GPay / PhonePe
                    </span>
                  </div>
                </label>

                {paymentMethod === 'upi' && (
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                    <label className="block text-[11px] font-bold text-gray-700 uppercase">
                      Enter UPI ID / VPA
                    </label>
                    <input
                      type="text"
                      placeholder="username@okhdfcbank"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm focus:border-[#E50914] focus:outline-none"
                    />
                    <p className="text-[10px] text-gray-500">
                      Or approve the transaction on your Google Pay, PhonePe, or Paytm app.
                    </p>
                  </div>
                )}

                {/* Method 2: Debit / Credit Card */}
                <label
                  onClick={() => setPaymentMethod('card')}
                  className={`w-full p-3 sm:p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#E50914] bg-[#FFF9F9] shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        paymentMethod === 'card'
                          ? 'border-[#E50914] bg-[#E50914]'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {paymentMethod === 'card' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>
                    <span className="font-bold text-gray-900 text-sm">Debit / Credit Card</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <svg className="w-6 h-4" viewBox="0 0 24 16" fill="none" stroke="currentColor">
                      <rect width="24" height="16" rx="2" strokeWidth="2" />
                      <line y1="5" x2="24" y2="5" strokeWidth="2" />
                    </svg>
                  </div>
                </label>

                {paymentMethod === 'card' && (
                  <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl space-y-2.5 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        maxLength={19}
                        placeholder="4532 •••• •••• 8892"
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:border-[#E50914] focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">
                          Expiry
                        </label>
                        <input
                          type="text"
                          maxLength={5}
                          placeholder="MM/YY"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:border-[#E50914] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">
                          CVV
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          placeholder="•••"
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:border-[#E50914] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Method 3: Net Banking */}
                <label
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`w-full p-3 sm:p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === 'netbanking'
                      ? 'border-[#E50914] bg-[#FFF9F9] shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        paymentMethod === 'netbanking'
                          ? 'border-[#E50914] bg-[#E50914]'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {paymentMethod === 'netbanking' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </span>
                    <span className="font-bold text-gray-900 text-sm">Net Banking</span>
                  </div>
                  <span className="text-xs text-gray-500 font-semibold">All Indian Banks</span>
                </label>

                {paymentMethod === 'netbanking' && (
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                    <label className="block text-[11px] font-bold text-gray-700 uppercase">
                      Select Bank
                    </label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm focus:border-[#E50914] focus:outline-none"
                    >
                      <option>HDFC Bank</option>
                      <option>ICICI Bank</option>
                      <option>State Bank of India (SBI)</option>
                      <option>Axis Bank</option>
                      <option>Kotak Mahindra Bank</option>
                    </select>
                  </div>
                )}

                {/* Method 4: Wallets */}
                <label
                  onClick={() => setPaymentMethod('wallets')}
                  className={`w-full p-3 sm:p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === 'wallets'
                      ? 'border-[#E50914] bg-[#FFF9F9] shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        paymentMethod === 'wallets'
                          ? 'border-[#E50914] bg-[#E50914]'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {paymentMethod === 'wallets' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </span>
                    <span className="font-bold text-gray-900 text-sm">Wallets</span>
                  </div>
                  <span className="text-xs font-bold text-blue-600">Paytm / PhonePe</span>
                </label>
              </div>

              {paymentError && (
                <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 text-[#E50914] rounded-xl text-xs font-semibold">
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Payment Failed
                  </div>
                  <p>{paymentError}</p>
                </div>
              )}

              {pendingNotice && (
                <div className="w-full mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs">
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <svg className="w-4 h-4 text-amber-600 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Payment Awaiting Confirmation
                  </div>
                  <p>{pendingNotice}</p>
                  <button
                    type="button"
                    onClick={handleExecutePayment}
                    className="mt-2 text-xs font-bold text-amber-800 underline cursor-pointer"
                  >
                    Re-check Payment Status Now
                  </button>
                </div>
              )}

              <button
                type="button"
                disabled={isProcessingPayment}
                onClick={handleExecutePayment}
                className="w-full py-3.5 bg-[#E50914] hover:bg-[#c81e24] disabled:opacity-60 text-white font-extrabold text-sm sm:text-base uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer focus:outline-none flex items-center justify-center gap-2"
              >
                {isProcessingPayment ? (
                  <>
                    <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Verifying Payment with Server...
                  </>
                ) : (
                  `Pay ₹${selectedPackage.price}`
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep('confirm')}
                className="mt-2.5 text-xs text-gray-500 hover:text-black font-semibold cursor-pointer"
              >
                ← Back to Order Summary
              </button>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 5: PURCHASE COMPLETE / PAYMENT SUCCESSFUL            */}
          {/* ========================================================= */}
          {step === 'success' && currentOrder && (
            <div className="flex flex-col items-center text-center py-1 sm:py-2">
              {/* Custom Foodbliz Red Scalloped Floral Verification Badge */}
              <div className="mb-4">
                <FoodblizFloralBadge size="lg" />
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                Payment Successful!
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 mb-5">
                Your <span className="font-extrabold text-gray-900">{currentOrder.packageName}</span> package is now active.
              </p>

              {/* Package Content Features Included */}
              <div className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3.5 sm:p-4 mb-4">
                <div className="grid grid-cols-3 gap-2">
                  {currentOrder.features
                    .filter((f) => !f.disabled)
                    .map((feat, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-gray-200/80 rounded-xl p-2.5 flex flex-col items-center justify-center text-center shadow-2xs"
                      >
                        <span className="text-[#E50914] mb-1">
                          {feat.type === 'images' && (
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="4" width="18" height="16" rx="2" />
                              <polyline points="4 15 9 10 14 15 17 12 20 15" />
                            </svg>
                          )}
                          {feat.type === 'banners' && (
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M3 6h18v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6z" />
                              <path d="M7 11h10" />
                            </svg>
                          )}
                          {feat.type === 'video' && (
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="5" width="18" height="14" rx="3" />
                              <polygon points="10 9 15 12 10 15 10 9" fill="#E50914" />
                            </svg>
                          )}
                        </span>
                        <span className="text-[11px] sm:text-xs font-bold text-gray-900 leading-tight">
                          {feat.text}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Order Transaction Metadata Table */}
              <div className="w-full bg-white border border-gray-200 rounded-xl p-3 sm:p-3.5 text-xs text-left mb-6 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-500">Order ID:</span>
                  <span className="font-mono font-bold text-gray-900">{currentOrder.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Amount Paid:</span>
                  <span className="font-bold text-[#E50914]">₹{currentOrder.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Date:</span>
                  <span className="text-gray-800 font-medium">
                    {new Date(currentOrder.verifiedAt || currentOrder.createdAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Method:</span>
                  <span className="text-gray-800 font-medium">{currentOrder.paymentMethod}</span>
                </div>
                {currentOrder.packageType === 'subscription' && (
                  <div className="flex justify-between pt-1 border-t border-gray-100 text-emerald-700">
                    <span className="font-semibold">Next Billing:</span>
                    <span className="font-bold">
                      {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                )}
              </div>

              {/* CTAs matching reference */}
              <div className="w-full space-y-2.5">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenPurchases();
                  }}
                  className="w-full py-3.5 bg-[#E50914] hover:bg-[#c81e24] text-white font-extrabold text-sm uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer focus:outline-none"
                >
                  Go to Downloads
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onExploreFood();
                  }}
                  className="w-full py-2.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer focus:outline-none"
                >
                  Explore Food Pictures
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
