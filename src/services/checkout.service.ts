import { AuthService } from "@/services/auth.service";
import { PricingService } from "@/services/pricing.service";
import { CouponService } from "@/services/coupon.service";
import { PaymentService } from "@/services/payment.service";
import { OrderService } from "@/services/order.service";
import { ProductionService } from "@/services/production.service";
import type { StudioState } from "@/types";
import type { Order } from "@/types/checkout";
import { ValidationError } from "@/lib/errors";

export type CheckoutResult = {
  success: boolean;
  order?: Order;
  paymentId?: string;
  error?: string;
};

export const CheckoutService = {
  async placeOrder(state: StudioState, addressId: string, couponCode?: string): Promise<CheckoutResult> {
    const user = await AuthService.requireAuth();

    if (!state.bookId) {
      throw new ValidationError("No book selected");
    }

    if (!state.edition) {
      throw new ValidationError("Please select an edition");
    }

    const breakdown = await PricingService.breakdown(state);

    let discountAmount = 0;
    let couponId: string | undefined;
    let finalCouponCode: string | undefined;

    if (couponCode) {
      const validation = await CouponService.validate(couponCode, breakdown.subtotal);
      if (!validation.valid) {
        throw new ValidationError(validation.message ?? "Invalid coupon");
      }
      discountAmount = validation.discount ?? 0;
      couponId = validation.coupon?.id;
      finalCouponCode = couponCode;
    }

    const total = breakdown.subtotal + breakdown.shipping - discountAmount;

    const payment = await PaymentService.process(total);

    if (!payment.success) {
      throw new ValidationError(payment.error ?? "Payment failed");
    }

    const order = await OrderService.create({
      bookId: state.bookId,
      addressId,
      subtotal: breakdown.subtotal,
      shippingCost: breakdown.shipping,
      discountAmount,
      total,
      couponId,
      couponCode: finalCouponCode,
      paymentMethod: payment.paymentMethod,
      paymentId: payment.paymentId,
    });

    ProductionService.startProduction(order.id).catch((err) => {
      console.error("Production start failed (order still placed):", err);
    });

    return { success: true, order, paymentId: payment.paymentId };
  },
};
