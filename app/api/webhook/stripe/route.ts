import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();

    const signature = headers().get("Stripe-Signature") as string;

    let event: Stripe.Event;

    event = await stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );
      const customerId = String(session.customer);

      const user = await prisma.user.findUnique({
        where: {
          stripeCustomerId: customerId,
        },
      });

      if (!user) {
        return NextResponse.json(
          { error: "Stripe User not found" },
          { status: 400 }
        );
      }

      const response = await prisma.subscription.create({
        data: {
          stripeSubscriptionId: subscription.id,
          userId: user.id,
          currentPeriodStart: subscription.current_period_start,
          curentPeriodEnd: subscription.current_period_end,
          status: subscription.status,
          planId: subscription.items.data[0].plan.id,
          interval: String(subscription.items.data[0].plan.interval),
        },
      });

      return NextResponse.json(response.status, { status: 201 });
    }

    if (event.type === "invoice.payment_succeeded") {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );

      await prisma.subscription.update({
        where: {
          stripeSubscriptionId: subscription.id,
        },
        data: {
          planId: subscription.items.data[0].price.id,
          currentPeriodStart: subscription.current_period_start,
          curentPeriodEnd: subscription.current_period_end,
          status: subscription.status,
        },
      });
    }

    return NextResponse.json(null, { status: 200 });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { error: `Error in Stripe Webhook ${error}` },
      { status: 500 }
    );
  }
}
