import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { paymentAPI } from '../services/api/paymentService';
import { upgradeUserToPro } from '../features/auth/authSlice';

const RAZORPAY_KEY_ID = 'rzp_test_SRrgv3DmWzaVKt';

export default function ProUpgradeModal({ onClose }) {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) return resolve(true);
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleUpgrade = async () => {
        setIsLoading(true);
        try {
            const loaded = await loadRazorpayScript();
            if (!loaded) {
                toast.error('Failed to load Razorpay. Check your connection.');
                setIsLoading(false);
                return;
            }

            const { data } = await paymentAPI.createOrder();

            const options = {
                key: RAZORPAY_KEY_ID,
                amount: data.amount,
                currency: data.currency,
                name: 'SinhgadConnect',
                description: 'Pro Membership - 30 Days',
                order_id: data.orderId,
                handler: async (response) => {
                    try {
                        const verifyRes = await paymentAPI.verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });
                        dispatch(upgradeUserToPro({ proExpiresAt: verifyRes.data.user.proExpiresAt }));
                        toast.success('🎉 You are now a Pro member!');
                        onClose();
                    } catch {
                        toast.error('Payment verification failed. Contact support.');
                    }
                },
                prefill: { name: '', email: '', contact: '' },
                theme: { color: '#6366f1' },
                modal: { ondismiss: () => setIsLoading(false) }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-purple-500/30 rounded-2xl max-w-md w-full p-8 shadow-2xl shadow-purple-900/30 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
                >✕</button>

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="text-5xl mb-3">⚡</div>
                    <h2 className="text-3xl font-bold text-white mb-2">Upgrade to Pro</h2>
                    <p className="text-gray-400">Unlock the full potential of SinhgadConnect</p>
                </div>

                {/* Pricing */}
                <div className="bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border border-purple-500/40 rounded-xl p-6 mb-6 text-center">
                    <div className="text-5xl font-bold text-white mb-1">₹99</div>
                    <div className="text-gray-400 text-sm">per month</div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                    {[
                        ['💬', '100 AI chat messages/hour', '20 for Free'],
                        ['📝', '20 posts/hour', '5 for Free'],
                        ['⭐', 'Pro badge on your profile', ''],
                        ['🚀', 'Priority AI responses', ''],
                    ].map(([icon, feature, limit]) => (
                        <li key={feature} className="flex items-center gap-3 text-sm">
                            <span className="text-lg">{icon}</span>
                            <span className="text-gray-200 flex-1">{feature}</span>
                            {limit && <span className="text-gray-500 text-xs">(vs {limit})</span>}
                        </li>
                    ))}
                </ul>

                {/* CTA Button */}
                <button
                    onClick={handleUpgrade}
                    disabled={isLoading}
                    className="w-full py-4 rounded-xl font-bold text-white text-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-purple-700/40"
                >
                    {isLoading ? 'Opening Razorpay...' : '⚡ Upgrade Now — ₹99/month'}
                </button>

                <p className="text-center text-gray-500 text-xs mt-3">
                    Secured by Razorpay • Cancel anytime
                </p>
            </div>
        </div>
    );
}
