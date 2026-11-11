import React, { useState, useEffect } from 'react';
import {
  CustomerProfile,
  OrderRecord,
  SubscriptionRecord,
  fetchUserPurchases,
  cancelSubscriptionAutoRenewal
} from '../services/checkoutService';

interface MyPurchasesModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerProfile | null;
  onOpenCheckoutForPackage: () => void;
  onDownloadAsset: (name: string, type: string) => void;
}

export const MyPurchasesModal: React.FC<MyPurchasesModalProps> = ({
  isOpen,
  onClose,
  customer,
  onOpenCheckoutForPackage,
  onDownloadAsset
}) => {
  const [activeTab, setActiveTab] = useState<'packages' | 'subscriptions' | 'downloads'>('packages');
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && customer && customer.email) {
      setIsLoading(true);
      fetchUserPurchases(customer.email).then((data) => {
        setOrders(data.orders);
        setSubscriptions(data.subscriptions);
        setIsLoading(false);
      });
    }
  }, [isOpen, customer]);

  if (!isOpen) return null;

  const handleCancelSub = async (subId: string) => {
    const res = await cancelSubscriptionAutoRenewal(subId);
    setStatusMessage(res.message);
    if (customer) {
      const data = await fetchUserPurchases(customer.email);
      setSubscriptions(data.subscriptions);
    }
    setTimeout(() => setStatusMessage(null), 3500);
  };

  // Sample curated assets available under active packages
  const SAMPLE_DOWNLOAD_ASSETS = [
    {
      id: 'ast-1',
      title: 'Hyderabadi Dum Biryani (Hero Shoot)',
      type: 'image',
      format: '4000x3000px High-Res JPG',
      size: '14.2 MB',
      thumb:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDlt-GPML9IDb7t0dgQGs7eipLliajlQXkb_OWHOrOLBHGNm61w6CLWM4DG3auLAMP_krnuIDnn3OyD5S0vpEg-YeveqkeZKdJOPaeVsktUUVHlmyOueA0asm8ngwsDSZ_OIaXpvvF1kJW9b-yVoNizbZadjyvgAl97tN4fLPv-clCdfd1YlShQhTWfhDtejyxtcbEzq12WnRFkkaSNwQctbNLWlLDKAZiydv-vxoaN-zSXgZGOW2J8Cnl9Qkrm2IJREw'
    },
    {
      id: 'ast-2',
      title: 'Beverage & Mojito Splash (Menu Banner)',
      type: 'banner',
      format: '1920x1080px Promo Banner',
      size: '8.4 MB',
      thumb:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCT3XQjszc8I6nO9wCY7pJ_zbzLYsH1Bqcpeibh9EKZsEh07RN5tSRglrXcmck--RqpgRd_l9wbQWE9iUTA6iLF240C_iW_KRwB3AzoRxSGpdZzPqPS7t4Tz0SXdFVVqMCeSl6yjwXYq2jm-Sz7Ibad-2XEvOT7gKqnf2HcDrgiwYq0rrdw67C0PvNBV_1j84pGexSwOXOLNbpmV3dA01diq0B9uVv8GnhkiILjZlj2Fs-UZCtbtzs47cidF-KBY1aPjQ'
    },
    {
      id: 'ast-3',
      title: 'Artisan Cheesy Burger Sizzle (Short Video)',
      type: 'video',
      format: '4K MP4 (60fps Reel / Story)',
      size: '42.8 MB',
      thumb:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCQVX5rXm68FVSJ3b200ydjpxYKjH_gSHUadm0RD7SoSrROaqacdD6-2xq1NWF5Sowj6IOkBvhoQ2rGt3_l4B8GEH9jaFBZUCu_6JsO_oCRkjzGrOyLa020Qw-BsDxqaABo3GKJMqp2zuMlEOv3miSAtDxTUGeVM-1ShVmKlIPuLMHP-f-u01QQI6lbm0ily0Lu_eFs4IgXIWAgqNP5-hTZvU7mdFYAUmW47pw2Zy26mGUtAPNVzsVO59RYy4bBAhOggQ'
    }
  ];

  return (
    <div
      aria-hidden="false"
      data-modal-overlay="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-xs transition-opacity duration-200 overscroll-contain overflow-y-auto"
      id="my-purchases-modal"
    >
      <div
        data-modal-scroll-container="true"
        className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 overflow-hidden my-auto transform transition-transform duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-neutral-900 text-white px-5 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-[#E50914] flex items-center justify-center text-white">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" />
                <path d="M7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z" />
              </svg>
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                My Purchases & Content
              </h2>
              <p className="text-[11px] text-gray-400">
                {customer?.fullName} · {customer?.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-gray-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <svg className="w-4 h-4 stroke-current fill-none stroke-[2.5]" viewBox="0 0 24 24">
              <line x1="18" x2="6" y1="6" y2="18" />
              <line x1="6" x2="18" y1="6" y2="18" />
            </svg>
          </button>
        </div>

        {/* Status banner */}
        {statusMessage && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-2.5 text-xs text-emerald-800 font-semibold flex items-center justify-between">
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex border-b border-gray-200 px-5 pt-3 gap-2 bg-gray-50/60">
          <button
            type="button"
            onClick={() => setActiveTab('packages')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'packages'
                ? 'border-[#E50914] text-[#E50914]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Order History ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('subscriptions')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'subscriptions'
                ? 'border-[#E50914] text-[#E50914]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Subscriptions ({subscriptions.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('downloads')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'downloads'
                ? 'border-[#E50914] text-[#E50914]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Download Center
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 max-h-[65vh] overflow-y-auto">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-gray-400 gap-2">
              <svg className="animate-spin w-6 h-6 text-[#E50914]" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span className="text-xs">Loading verified purchases...</span>
            </div>
          ) : null}

          {/* Tab 1: Orders */}
          {!isLoading && activeTab === 'packages' && (
            <div className="space-y-3">
              {orders.length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3 text-gray-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="2" y="5" width="20" height="14" rx="2" strokeWidth="2" />
                      <line x1="2" y1="10" x2="22" y2="10" strokeWidth="2" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">No verified purchases yet</h3>
                  <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                    Choose an Essential, Signature, or Elite package to unlock premium high-res photography.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenCheckoutForPackage();
                    }}
                    className="mt-4 px-4 py-2 bg-[#E50914] text-white text-xs font-bold rounded-xl hover:bg-[#c81e24] transition-colors cursor-pointer"
                  >
                    Explore Packages
                  </button>
                </div>
              ) : (
                orders.map((ord) => (
                  <div
                    key={ord.orderId}
                    className="p-4 bg-gray-50 border border-gray-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-xs text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">
                          {ord.orderId}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          Paid & Verified
                        </span>
                      </div>
                      <h4 className="text-base font-black text-gray-900">
                        {ord.packageName}{' '}
                        <span className="text-xs font-semibold text-gray-500">
                          ({ord.packageType === 'subscription' ? 'Monthly Plan' : 'One-Time Package'})
                        </span>
                      </h4>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {ord.features
                          .filter((f) => !f.disabled)
                          .map((f) => f.text)
                          .join(' · ')}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-1">
                        Paid on {new Date(ord.verifiedAt || ord.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}{' '}
                        via {ord.paymentMethod}
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-200">
                      <span className="text-lg font-black text-[#E50914]">₹{ord.price}</span>
                      <button
                        type="button"
                        onClick={() => setActiveTab('downloads')}
                        className="px-3 py-1.5 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Access Downloads
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 2: Subscriptions */}
          {!isLoading && activeTab === 'subscriptions' && (
            <div className="space-y-3">
              {subscriptions.length === 0 ? (
                <div className="text-center py-10">
                  <h3 className="text-sm font-bold text-gray-900">No active subscriptions</h3>
                  <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                    Subscribe to a monthly plan for ongoing fresh culinary visuals and seasonal menus.
                  </p>
                </div>
              ) : (
                subscriptions.map((sub) => (
                  <div
                    key={sub.subscriptionId}
                    className="p-4 bg-[#FFF9F9] border-2 border-red-200 rounded-2xl flex flex-col justify-between gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-gray-700">
                        {sub.subscriptionId}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          sub.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {sub.status === 'active' ? '● Active Subscription' : 'Cancelled (Expires End of Period)'}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-black text-gray-900">{sub.packageName} Monthly Plan</h4>
                      <p className="text-xs font-bold text-[#E50914]">
                        ₹{sub.price} / month · Full Commercial Rights
                      </p>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-red-100 grid grid-cols-3 gap-2 text-center text-xs">
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase block">Images</span>
                        <span className="font-extrabold text-gray-900">{sub.imagesTotal} / mo</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase block">Banners</span>
                        <span className="font-extrabold text-gray-900">{sub.bannersTotal} / mo</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase block">Videos</span>
                        <span className="font-extrabold text-gray-900">{sub.videosTotal} / mo</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-600 pt-1 border-t border-red-100">
                      <span>
                        Next Billing:{' '}
                        <strong>
                          {new Date(sub.nextBillingDate).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </strong>
                      </span>

                      {sub.status === 'active' && (
                        <button
                          type="button"
                          onClick={() => handleCancelSub(sub.subscriptionId)}
                          className="text-xs font-bold text-gray-500 hover:text-red-600 cursor-pointer underline"
                        >
                          Cancel Auto-Renewal
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 3: Downloads */}
          {!isLoading && activeTab === 'downloads' && (
            <div className="space-y-3">
              <p className="text-xs text-gray-500 mb-2">
                All downloaded assets include unrestricted commercial licenses for Swiggy, Zomato, Social Media, and Print.
              </p>

              <div className="space-y-2.5">
                {SAMPLE_DOWNLOAD_ASSETS.map((asset) => (
                  <div
                    key={asset.id}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={asset.thumb}
                        alt={asset.title}
                        className="w-12 h-12 rounded-lg object-contain bg-white border border-gray-200 p-1 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                          {asset.title}
                        </h4>
                        <span className="text-[11px] text-gray-500 block">
                          {asset.format} · {asset.size}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onDownloadAsset(asset.title, asset.type)}
                      className="px-3 py-1.5 bg-[#E50914] hover:bg-[#c81e24] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
