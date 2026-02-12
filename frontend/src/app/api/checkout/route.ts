import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_ID;

  if (!secretKey || !priceId) {
    return NextResponse.json(
      { error: "Stripe is not configured. Set STRIPE_SECRET_KEY and STRIPE_PRICE_ID." },
      { status: 500 }
    );
  }

  const stripe = new Stripe(secretKey, { apiVersion: "2025-01-27.acacia" as Stripe.LatestApiVersion });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/?canceled=true`,
    });

    return NextResponse.redirect(session.url!, 303);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
