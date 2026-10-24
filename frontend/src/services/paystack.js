/**
 * Official Paystack Inline SDK Integration
 * Invokes the authentic Paystack Checkout popup (checkout.paystack.com)
 */

export const openPaystackPopup = ({
  email = "tunde.adeyemi@example.com",
  amountNgn,
  paymentType = "service_fee",
  title = "TravelForge Consular Fee",
  metadata = {},
  onSuccess,
  onCancel,
}) => {
  const paystackKey =
    import.meta.env.VITE_PAYSTACK_PUBLIC_KEY ||
    "pk_live_ef0b68230a8ac1631ebceb6a613000203a1a1f7e";

  const launch = () => {
    if (typeof window !== "undefined" && window.PaystackPop) {
      const handler = window.PaystackPop.setup({
        key: paystackKey,
        email: email,
        amount: Math.round(Number(amountNgn) * 100), // amount in kobo
        currency: "NGN",
        ref: `TF_${paymentType.toUpperCase()}_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`,
        metadata: {
          custom_fields: [
            {
              display_name: "Service Description",
              variable_name: "service_description",
              value: title,
            },
            ...Object.entries(metadata).map(([k, v]) => ({
              display_name: k,
              variable_name: k,
              value: String(v),
            })),
          ],
        },
        callback: function (response) {
          console.log("Paystack payment successful! Reference:", response.reference);
          if (onSuccess) {
            onSuccess({
              reference: response.reference,
              trans: response.trans || response.reference,
              status: "success",
              message: "Payment approved by Paystack",
            });
          }
        },
        onClose: function () {
          console.log("Paystack checkout modal closed by user");
          if (onCancel) onCancel();
        },
      });
      handler.openIframe();
    } else {
      console.warn("PaystackPop script not detected, attempting dynamic injection...");
      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.async = true;
      script.onload = () => launch();
      script.onerror = () => {
        alert("Failed to load Paystack payment gateway. Please check your internet connection.");
      };
      document.head.appendChild(script);
    }
  };

  launch();
};
