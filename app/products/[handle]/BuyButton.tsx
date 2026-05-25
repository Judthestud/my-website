"use client";

export default function BuyButton({ variantId }: { variantId: string }) {
  async function handleBuyNow() {
    const res = await fetch("/api/shopify-cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ variantId }),
    });

    const data = await res.json();

    console.log("CHECKOUT DATA:", data);

    if (data.checkoutUrl) {
      window.open(data.checkoutUrl, "_blank");
    }
  }

  return (
    <button
      onClick={handleBuyNow}
      className="mt-10 inline-flex w-fit items-center justify-center rounded-full border border-purple-300/30 bg-purple-500/10 px-8 py-4 text-xs uppercase tracking-[0.3em] text-purple-100 transition hover:bg-purple-500/20 hover:text-white"
    >
      Buy Now
    </button>
  );
} 