import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { StudioShell } from "@/components/studio/StudioShell";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { AddressForm } from "@/components/checkout/AddressForm";
import { useStudio } from "@/stores/studio";
import { PricingService } from "@/services/pricing.service";
import { AddressService } from "@/services/address.service";
import { CouponService } from "@/services/coupon.service";
import { CheckoutService } from "@/services/checkout.service";
import { AuthService } from "@/services/auth.service";
import { config } from "@/config";
import type { Address, AddressInput, PriceBreakdown } from "@/types/checkout";
import type { CouponValidation } from "@/types/checkout";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Stacked Stone" },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const navigate = useNavigate();
  const { state } = useStudio();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [breakdown, setBreakdown] = useState<PriceBreakdown | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponResult, setCouponResult] = useState<CouponValidation | null>(null);
  const [couponChecking, setCouponChecking] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      await AuthService.requireAuth();
      const [addrs, price] = await Promise.all([
        AddressService.list(),
        PricingService.breakdown(state),
      ]);
      setAddresses(addrs);
      setBreakdown(price);
      const defaultAddr = addrs.find((a) => a.is_default);
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
      } else if (addrs.length > 0) {
        setSelectedAddressId(addrs[0].id);
      }
    } catch (err: any) {
      if (err?.code === "UNAUTHORIZED") {
        navigate({ to: "/login", search: { redirect: "/checkout" } });
        return;
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddAddress(data: AddressInput) {
    const addr = await AddressService.create(data);
    setAddresses((prev) => [addr, ...prev]);
    setSelectedAddressId(addr.id);
    setShowAddForm(false);
  }

  async function checkCoupon() {
    if (!couponCode.trim() || !breakdown) return;
    setCouponChecking(true);
    try {
      const result = await CouponService.validate(couponCode, breakdown.subtotal);
      setCouponResult(result);
      if (result.valid && breakdown) {
        setBreakdown({
          ...breakdown,
          discount: result.discount ?? 0,
          total: breakdown.subtotal + breakdown.shipping - (result.discount ?? 0),
        });
      }
    } catch {
      setCouponResult({ valid: false, message: "Failed to validate coupon" });
    } finally {
      setCouponChecking(false);
    }
  }

  function handlePlaceOrder() {
    if (!selectedAddressId) {
      setError("Please select a delivery address");
      return;
    }
    setError("");
    setShowPaymentModal(true);
  }

  async function confirmPayment() {
    if (!selectedAddressId || !breakdown) return;
    setSubmitting(true);
    try {
      const result = await CheckoutService.placeOrder(
        state,
        selectedAddressId,
        couponResult?.valid ? couponCode : undefined,
      );

      if (result.success && result.order) {
        const orderNumber = result.order.order_number;
        navigate({ to: "/success", search: { order: orderNumber } });
      } else {
        throw new Error(result.error ?? "Order failed");
      }
    } catch (err: any) {
      setError(err.message);
      setShowPaymentModal(false);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <StudioShell current="/checkout">
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
        </div>
      </StudioShell>
    );
  }

  return (
    <StudioShell current="/checkout">
      <section className="container-edit pt-24 md:pt-32 pb-32">
        <div className="grid md:grid-cols-12 gap-16">
          <div className="md:col-span-7 space-y-14">
            <header>
              <p className="eyebrow">Quietly · The Last Step</p>
              <h1 className="display mt-6 text-5xl md:text-6xl">A few last details.</h1>
            </header>

            {/* Address selection */}
            <section>
              <h2 className="eyebrow mb-6">Where the book finds you</h2>

              {addresses.length > 0 && !showAddForm && (
                <div className="space-y-4 mb-8">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`block border p-5 rounded-lg cursor-pointer transition-colors ${
                        selectedAddressId === addr.id
                          ? "border-ink bg-ink/5"
                          : "border-border hover:border-foreground/40"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                          className="mt-1 accent-ink"
                        />
                        <div>
                          <p className="font-serif text-lg">{addr.name || addr.line1}</p>
                          <p className="text-muted-foreground text-sm mt-1">
                            {addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}<br />
                            {addr.city}{addr.state ? `, ${addr.state}` : ""} — {addr.postal_code}
                          </p>
                          {addr.phone && <p className="text-muted-foreground text-xs mt-1">{addr.phone}</p>}
                          {addr.is_default && (
                            <span className="eyebrow text-[0.55rem] mt-2 inline-block">Default</span>
                          )}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {showAddForm ? (
                <div className="border border-border rounded-lg p-6">
                  <AddressForm onSubmit={handleAddAddress} onCancel={() => setShowAddForm(false)} />
                </div>
              ) : (
                <button onClick={() => setShowAddForm(true)} className="btn-ghost text-sm">
                  + Add new address
                </button>
              )}
            </section>

            {/* Coupon */}
            <section>
              <h2 className="eyebrow mb-4">Coupon code</h2>
              <div className="flex items-end gap-4 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                  <input
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value);
                      setCouponResult(null);
                    }}
                    placeholder="Enter code"
                    className="w-full bg-transparent border-b border-foreground/30 focus:border-foreground outline-none py-2.5 font-serif text-lg placeholder:text-muted-foreground/60 uppercase"
                  />
                </div>
                <button
                  type="button"
                  onClick={checkCoupon}
                  disabled={couponChecking || !couponCode.trim()}
                  className="btn-ghost !py-2.5"
                >
                  {couponChecking ? "Checking…" : "Apply"}
                </button>
              </div>
              {couponResult && (
                <p className={`text-sm mt-2 ${couponResult.valid ? "text-green-700" : "text-red-600"}`}>
                  {couponResult.message}
                </p>
              )}
            </section>

            {/* Error */}
            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}

            {/* Place order */}
            <div className="pt-6 flex flex-wrap items-center gap-8">
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={!selectedAddressId}
                className="btn-primary"
              >
                Place the order · ₹{breakdown?.total ?? 0}
              </button>
              <p className="text-muted-foreground text-sm max-w-xs">
                Your book begins printing within 48 hours. You'll receive it in 10–14 days.
              </p>
            </div>
          </div>

          {/* Order summary sidebar */}
          <div className="md:col-span-4 md:col-start-9 md:sticky md:top-32 self-start">
            {breakdown && (
              <OrderSummary
                state={state}
                breakdown={breakdown}
                couponMessage={couponResult?.valid ? couponResult.message : undefined}
              />
            )}
          </div>
        </div>
      </section>

      {/* Payment confirmation modal */}
      {showPaymentModal && breakdown && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg max-w-md w-full p-8 shadow-xl">
            <h2 className="font-serif text-3xl italic">Confirm payment</h2>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              You are about to pay <strong className="text-foreground">₹{breakdown.total}</strong> for
              your volume. This is a secure transaction.
            </p>

            {!config.razorpay.keyId && (
              <p className="text-xs text-muted-foreground mt-3 italic">
                Mock payment — no real charge will be made.
              </p>
            )}

            <div className="mt-8 flex items-center gap-4">
              <button
                onClick={confirmPayment}
                disabled={submitting}
                className="btn-primary"
              >
                {submitting ? "Processing…" : `Pay ₹${breakdown.total}`}
              </button>
              <button
                onClick={() => setShowPaymentModal(false)}
                disabled={submitting}
                className="btn-ghost"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </StudioShell>
  );
}
