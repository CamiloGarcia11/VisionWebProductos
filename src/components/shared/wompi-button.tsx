"use client";

import { useEffect, useState } from "react";
import { CreditCard } from "lucide-react";

interface WompiButtonProps {
  amountInCents?: number;
  reference?: string;
  publicKey?: string;
  currency?: string;
  redirectUrl?: string;
}

declare global {
  interface Window {
    WidgetCheckout?: any;
  }
}

export default function TestWompiButton({
  amountInCents = 3900000,
  reference,
  publicKey = process.env.NEXT_PUBLIC_VISIONWEB_WOMPI_PUB_KEY || "pub_test_Q5y15KS2WDVW0vTrgFNy2iktWU8yOSMu",
  currency = "COP",
  redirectUrl,
}: WompiButtonProps) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!document.getElementById("wompi-script-cdn")) {
      const script = document.createElement("script");
      script.id = "wompi-script-cdn";
      script.src = "https://checkout.wompi.co/widget.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handlePay = () => {
    const activeRef = reference || `TEST-${Date.now()}`;
    const activeRedirect = redirectUrl || (typeof window !== "undefined" ? `${window.location.origin}/dashboard/subscription?status=success` : "");

    if (typeof window !== "undefined" && window.WidgetCheckout) {
      const checkout = new window.WidgetCheckout({
        currency: currency,
        amountInCents: amountInCents,
        reference: activeRef,
        publicKey: publicKey,
        redirectUrl: activeRedirect,
      });

      checkout.open((result: any) => {
        console.log("Resultado del pago Wompi:", result);
      });
    } else {
      const fallbackUrl = `https://checkout.wompi.co/p/?public-key=${publicKey}&currency=${currency}&amount-in-cents=${amountInCents}&reference=${activeRef}&redirect-url=${encodeURIComponent(activeRedirect)}`;
      window.open(fallbackUrl, "_blank");
    }
  };

  return (
    <div className="w-full">
      <button 
        onClick={handlePay}
        type="button"
        className="glow-button w-full text-white font-extrabold py-3.5 rounded-2xl transition flex items-center justify-center gap-2 text-xs uppercase tracking-wider shadow-xl"
      >
        <CreditCard className="h-4 w-4 text-white" /> Probar Widget de Wompi (${(amountInCents / 100).toLocaleString("es-CO")} COP)
      </button>
    </div>
  );
}

export { TestWompiButton as WompiButton };
