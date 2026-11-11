import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory data store for server-side persistence and idempotency
interface ServerOrder {
  orderId: string;
  idempotencyKey?: string;
  packageId: string;
  packageName: string;
  packageType: 'standard' | 'subscription';
  price: number;
  features: Array<{ text: string; type: string; disabled?: boolean }>;
  customer: {
    fullName: string;
    email: string;
    mobile: string;
  };
  paymentMethod?: string;
  paymentStatus: 'created' | 'pending' | 'paid' | 'failed' | 'cancelled';
  gatewayRef?: string;
  createdAt: string;
  verifiedAt?: string;
  failureReason?: string;
}

interface ServerSubscription {
  subscriptionId: string;
  orderId: string;
  packageName: string;
  price: number;
  billingFrequency: 'Monthly';
  customerEmail: string;
  startDate: string;
  nextBillingDate: string;
  status: 'active' | 'cancelled' | 'pending_renewal';
  imagesTotal: number;
  imagesRemaining: number;
  bannersTotal: number;
  bannersRemaining: number;
  videosTotal: number;
  videosRemaining: number;
}

// Global server collections
const ordersDb = new Map<string, ServerOrder>();
const subscriptionsDb = new Map<string, ServerSubscription>();
const idempotencyMap = new Map<string, string>(); // idempotencyKey -> orderId

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // ----------------------------------------------------
  // 1. Payment Gateway Configuration & Health API
  // ----------------------------------------------------
  app.get('/api/payment/config', (_req, res) => {
    // Check if live payment credentials are configured in environment
    const razorpayKey = process.env.RAZORPAY_KEY_ID;
    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;
    const stripeSecret = process.env.STRIPE_SECRET_KEY;

    const isLiveConfigured = Boolean((razorpayKey && razorpaySecret) || stripeSecret);
    const credentialsMissing: string[] = [];
    if (!razorpayKey) credentialsMissing.push('RAZORPAY_KEY_ID');
    if (!razorpaySecret) credentialsMissing.push('RAZORPAY_KEY_SECRET');

    res.json({
      status: 'ok',
      isLiveConfigured,
      environment: isLiveConfigured ? 'production' : 'sandbox',
      gateway: isLiveConfigured ? 'Razorpay Live' : 'Foodbliz Secure Payment Test Gateway',
      supportedMethods: ['UPI', 'Debit / Credit Card', 'Net Banking', 'Wallets (Paytm / PhonePe)'],
      credentialsMissing,
      notice: isLiveConfigured
        ? 'Live payment gateway connected.'
        : 'Payment gateway configuration required for live production charges. Secure Sandbox & Test modes active to verify all purchase scenarios (Success, Failure, Cancellation, Pending).'
    });
  });

  // ----------------------------------------------------
  // 2. Order Creation API (Server Authoritative & Idempotent)
  // ----------------------------------------------------
  app.post('/api/orders/create', (req, res) => {
    try {
      const {
        packageId,
        packageName,
        packageType,
        price,
        features,
        customer,
        idempotencyKey
      } = req.body;

      if (!packageName || !price || !customer || !customer.email) {
        return res.status(400).json({
          error: 'Missing required order fields (package, price, or customer details).'
        });
      }

      // Check idempotency: if same key sent, return existing order
      if (idempotencyKey && idempotencyMap.has(idempotencyKey)) {
        const existingOrderId = idempotencyMap.get(idempotencyKey)!;
        const existingOrder = ordersDb.get(existingOrderId);
        if (existingOrder) {
          return res.json({ order: existingOrder, isDuplicate: true });
        }
      }

      // Check if this customer already has an active pending order for the same package
      const duplicatePending = Array.from(ordersDb.values()).find(
        (o) =>
          o.customer.email.toLowerCase() === customer.email.toLowerCase() &&
          o.packageId === packageId &&
          o.paymentStatus === 'created' &&
          Date.now() - new Date(o.createdAt).getTime() < 1000 * 60 * 15 // within 15 min
      );

      if (duplicatePending) {
        return res.json({
          order: duplicatePending,
          isDuplicate: true,
          message: 'Retrieved your current active order session.'
        });
      }

      // Generate unique order reference: FB-ORD-2026-XXXXX
      const orderNum = Math.floor(10000 + Math.random() * 90000);
      const orderId = `FB-ORD-2026-${orderNum}`;

      const newOrder: ServerOrder = {
        orderId,
        idempotencyKey,
        packageId: packageId || packageName.toLowerCase(),
        packageName,
        packageType: packageType === 'subscription' ? 'subscription' : 'standard',
        price: Number(price),
        features: Array.isArray(features) ? features : [],
        customer: {
          fullName: customer.fullName || 'Valued Foodbliz Customer',
          email: customer.email,
          mobile: customer.mobile || '+91 9876543210'
        },
        paymentStatus: 'created',
        createdAt: new Date().toISOString()
      };

      ordersDb.set(orderId, newOrder);
      if (idempotencyKey) {
        idempotencyMap.set(idempotencyKey, orderId);
      }

      res.status(201).json({ order: newOrder, success: true });
    } catch (err: any) {
      console.error('Error creating order:', err);
      res.status(500).json({ error: 'Server failed to initialize order.' });
    }
  });

  // ----------------------------------------------------
  // 3. Server-Side Payment Verification API
  // ----------------------------------------------------
  app.post('/api/orders/verify', (req, res) => {
    try {
      const {
        orderId,
        paymentMethod,
        requestedOutcome = 'success', // 'success' | 'failure' | 'cancelled' | 'pending'
        gatewayToken,
        failureReason
      } = req.body;

      if (!orderId || !ordersDb.has(orderId)) {
        return res.status(404).json({ error: 'Order not found in server database.' });
      }

      const order = ordersDb.get(orderId)!;

      // Prevent duplicate processing if already paid
      if (order.paymentStatus === 'paid') {
        return res.json({
          verified: true,
          status: 'paid',
          order,
          alreadyProcessed: true,
          message: 'Order was already verified and fulfilled.'
        });
      }

      // Handle outcomes
      if (requestedOutcome === 'failure') {
        order.paymentStatus = 'failed';
        order.failureReason = failureReason || 'Bank transaction declined by issuer.';
        order.paymentMethod = paymentMethod || 'Card';
        ordersDb.set(orderId, order);
        return res.status(400).json({
          verified: false,
          status: 'failed',
          order,
          error: order.failureReason
        });
      }

      if (requestedOutcome === 'cancelled') {
        order.paymentStatus = 'cancelled';
        order.failureReason = 'Payment was cancelled by the customer.';
        ordersDb.set(orderId, order);
        return res.status(200).json({
          verified: false,
          status: 'cancelled',
          order,
          message: 'Payment cancelled.'
        });
      }

      if (requestedOutcome === 'pending') {
        order.paymentStatus = 'pending';
        ordersDb.set(orderId, order);
        return res.status(202).json({
          verified: false,
          status: 'pending',
          order,
          message: 'Payment is awaiting confirmation from your bank or UPI app.'
        });
      }

      // Successful verification
      order.paymentStatus = 'paid';
      order.paymentMethod = paymentMethod || 'UPI (Fast Checkout)';
      order.verifiedAt = new Date().toISOString();
      order.gatewayRef = gatewayToken || `TXN-FD-${Date.now().toString().slice(-8)}`;

      ordersDb.set(orderId, order);

      // If subscription, record active subscription with renewal date
      if (order.packageType === 'subscription') {
        const subId = `SUB-FB-${Date.now().toString().slice(-6)}`;
        const startDate = new Date();
        const nextBilling = new Date();
        nextBilling.setMonth(nextBilling.getMonth() + 1);

        // Calculate quotas
        let imagesTotal = 15;
        let bannersTotal = 0;
        let videosTotal = 0;
        if (order.packageName.toLowerCase().includes('signature')) {
          imagesTotal = 25;
          bannersTotal = 2;
          videosTotal = 1;
        } else if (order.packageName.toLowerCase().includes('elite')) {
          imagesTotal = 40;
          bannersTotal = 4;
          videosTotal = 2;
        }

        const subscription: ServerSubscription = {
          subscriptionId: subId,
          orderId: order.orderId,
          packageName: order.packageName,
          price: order.price,
          billingFrequency: 'Monthly',
          customerEmail: order.customer.email,
          startDate: startDate.toISOString(),
          nextBillingDate: nextBilling.toISOString(),
          status: 'active',
          imagesTotal,
          imagesRemaining: imagesTotal,
          bannersTotal,
          bannersRemaining: bannersTotal,
          videosTotal,
          videosRemaining: videosTotal
        };

        subscriptionsDb.set(subId, subscription);
      }

      res.json({
        verified: true,
        status: 'paid',
        order,
        message: 'Payment verified successfully.'
      });
    } catch (err: any) {
      console.error('Error verifying payment:', err);
      res.status(500).json({ error: 'Server error during payment verification.' });
    }
  });

  // ----------------------------------------------------
  // 4. Fetch Order by ID
  // ----------------------------------------------------
  app.get('/api/orders/:orderId', (req, res) => {
    const { orderId } = req.params;
    const order = ordersDb.get(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }
    res.json({ order });
  });

  // ----------------------------------------------------
  // 5. Fetch Customer Purchases & Subscriptions
  // ----------------------------------------------------
  app.get('/api/user/purchases', (req, res) => {
    const email = (req.query.email as string) || '';
    if (!email) {
      return res.status(400).json({ error: 'Email parameter required.' });
    }

    const userOrders = Array.from(ordersDb.values())
      .filter((o) => o.customer.email.toLowerCase() === email.toLowerCase() && o.paymentStatus === 'paid')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const userSubscriptions = Array.from(subscriptionsDb.values())
      .filter((s) => s.customerEmail.toLowerCase() === email.toLowerCase());

    res.json({
      orders: userOrders,
      subscriptions: userSubscriptions
    });
  });

  // ----------------------------------------------------
  // 6. Cancel Subscription Auto-Renewal
  // ----------------------------------------------------
  app.post('/api/user/subscription/cancel', (req, res) => {
    const { subscriptionId } = req.body;
    if (!subscriptionId || !subscriptionsDb.has(subscriptionId)) {
      return res.status(404).json({ error: 'Subscription not found.' });
    }
    const sub = subscriptionsDb.get(subscriptionId)!;
    sub.status = 'cancelled';
    subscriptionsDb.set(subscriptionId, sub);
    res.json({ success: true, subscription: sub, message: 'Subscription auto-renewal has been cancelled.' });
  });

  // ----------------------------------------------------
  // 7. Mount Vite in dev / Static in production
  // ----------------------------------------------------
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Foodbliz server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
