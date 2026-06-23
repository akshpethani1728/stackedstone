import { config } from "@/config";
import { createRazorpayOrder } from "@/lib/razorpay.server";

export type PaymentResult = {
  success: boolean;
  paymentId?: string;
  paymentMethod: string;
  error?: string;
};

export const PaymentService = {
  async process(amount: number): Promise<PaymentResult> {
    const hasRazorpay = !!(config.razorpay.keyId);

    if (hasRazorpay) {
      return PaymentService._razorpayPayment(amount);
    }

    return PaymentService._mockPayment(amount);
  },

  async _razorpayPayment(amount: number): Promise<PaymentResult> {
    const keyId = config.razorpay.keyId!;

    const order = await createRazorpayOrder({ amount });

    return new Promise((resolve, reject) => {
      const options = {
        key: keyId,
        amount: order.amount,
        currency: "INR",
        name: config.appName,
        order_id: order.id,
        handler(response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) {
          resolve({
            success: true,
            paymentId: response.razorpay_payment_id,
            paymentMethod: "razorpay",
          });
        },
        modal: {
          ondismiss() {
            resolve({ success: false, paymentMethod: "razorpay", error: "Payment cancelled" });
          },
        },
        prefill: {
          contact: "",
          email: "",
        },
        theme: { color: "#1d1c1a" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", (resp: any) => {
        reject(new Error(resp.error?.description ?? "Payment failed"));
      });
      rzp.open();
    });
  },

  async _mockPayment(_amount: number): Promise<PaymentResult> {
    return {
      success: true,
      paymentId: `mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      paymentMethod: "mock",
    };
  },
};
