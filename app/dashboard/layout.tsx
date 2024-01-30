import DashboardNav from "@/components/DashboardNav";
import { ReactNode } from "react";

import prisma from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { stripe } from "@/lib/stripe";
import { unstable_noStore as noStore } from "next/cache";

async function getData({
  email,
  id,
  name,
}: {
  email: string;
  id: string;
  name: string | undefined | null;
}) {
  noStore();
  const user = await prisma?.user?.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      stripeCustomerId: true,
    },
  });

  if (!user) {
    const fullName = `${name ?? ""}`;
    await prisma.user.create({
      data: {
        id: id,
        email: email,
        name: fullName,
      },
    });
  }

  if (!user?.stripeCustomerId) {
    const data = await stripe.customers.create({
      email: email,
    });

    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        stripeCustomerId: data.id,
      },
    });
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await currentUser();

  if (user) {
    const email = user.emailAddresses[0].emailAddress;
    const { id, firstName } = user;
    await getData({
      email: email as string,
      id: id as string,
      name: firstName as string,
    });
  }
  return (
    <div className="flex flex-col mt-8">
      <div className="grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
          <DashboardNav />
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
