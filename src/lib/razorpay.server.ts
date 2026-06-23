import { createServerFn } from "@tanstack/react-start";

export const createRazorpayOrder = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as { amount: number; receipt?: string })
  .handler(async ({ data }) => {
    const keyId = process.env.VITE_RAZORPAY_KEY_ID ?? import.meta.env.VITE_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      throw new Error("Razorpay keys not configured on server");
    }

    const auth = btoa(`${keyId}:${keySecret}`);

    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: Math.round(data.amount * 100),
        currency: "INR",
        receipt: data.receipt ?? `ss_${Date.now()}`,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Razorpay order creation failed: ${body}`);
    }

    return res.json() as Promise<{
      id: string;
      amount: number;
      currency: string;
      receipt: string;
      status: string;
    }>;
  });
