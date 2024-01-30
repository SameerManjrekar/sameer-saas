import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@clerk/nextjs";
import { CheckCircle2 } from "lucide-react";

import prisma from "@/lib/db";
import { getStripeSession, stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import SubmitButton from "@/components/SubmitButton";
import { unstable_noStore as noStore } from "next/cache";
import StripeButton from "@/components/StripeButton";

const featuredItems = [
  {
    name: "Create personalized notes",
  },
  {
    name: "Auto Renew monthly",
  },
  {
    name: "Save 8% on annual subscription",
  },
  {
    name: "Cancel Subscription as per your needs",
  },
];

async function getData(userId: string) {
  noStore();
  const data = await prisma.subscription.findUnique({
    where: {
      userId: userId,
    },
    select: {
      status: true,
      user: {
        select: {
          stripeCustomerId: true,
        },
      },
    },
  });
  return data;
}

const BillingPage = async () => {
  const { userId } = auth();
  const data = await getData(userId as string);

  async function createSubscription() {
    "use server";

    const dbUser = await prisma.user.findUnique({
      where: {
        id: userId as string,
      },
      select: {
        stripeCustomerId: true,
      },
    });

    if (!dbUser?.stripeCustomerId) {
      throw new Error("Stripe Customer Id is not available!");
    }

    const subscriptionUrl = await getStripeSession({
      customerId: dbUser?.stripeCustomerId as string,
      priceId: process.env.STRIPE_PRODUCT_API_ID as string,
      domainUrl: process.env.DOMAIN_URL as string,
    });

    return redirect(subscriptionUrl);
  }

  async function createCustomerPortal() {
    "use server";
    const session = await stripe.billingPortal.sessions.create({
      customer: data?.user.stripeCustomerId as string,
      return_url: `${process.env.DOMAIN_URL}/dashboard`,
    });

    return redirect(session.url);
  }

  if (data?.status === "active") {
    return (
      <div className="grid items-start gap-8">
        <div className="flex items-center justify-between px-2">
          <div className="grid gap-1">
            <h1 className="text-3xl md:text-4xl">Subscription</h1>
            <p className="text-lg text-muted-foreground">
              Settings regarding your subscription
            </p>
          </div>
        </div>
        <Card className="w-full lg:w-2/3">
          <CardHeader>
            <CardTitle>Edit Subscription</CardTitle>
            <CardDescription>
              Click on button below, this will give you the opportunity to
              change your payment details and view your statement at the same
              time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createCustomerPortal}>
              <StripeButton />
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      <Card className="flex flex-col">
        <CardContent className="py-8">
          <div>
            <h3 className="inline-flex font-semibold px-4 py-1 text-sm tracking-wide uppercase bg-primary/10 text-primary rounded-full">
              Monthly
            </h3>
            <div className="mt-4 flex items-baseline text-full font-extrabold text-6xl">
              $30{" "}
              <span className="ml-1 text-2xl text-muted-foreground">/mo</span>
            </div>
            <p className="mt-5 text-lg text-muted-foreground">
              Write as many notes for $30 per month
            </p>
          </div>
        </CardContent>
        <div className="flex flex-1 flex-col justify-between px-6 pb-8 pt-6 bg-secondary rounded-lg m-1 space-y-6 sm:p-10">
          <ul className="space-y-4">
            {featuredItems.map((item, index) => (
              <li key={index} className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle2 className="size-6 text-green-500" />
                </div>
                <p className="ml-3 text-base"> {item.name}</p>
              </li>
            ))}
          </ul>
          <form action={createSubscription} className="w-full">
            <SubmitButton />
          </form>
        </div>
      </Card>
    </div>
  );
};

export default BillingPage;
