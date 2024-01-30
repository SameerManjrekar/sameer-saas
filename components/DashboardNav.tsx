"use client";

import { cn } from "@/lib/utils";
import { CreditCard, Home, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const navItems = [
  {
    name: "Home",
    path: "/dashboard",
    icon: Home,
  },
  {
    name: "Settings",
    path: "/dashboard/settings",
    icon: Settings,
  },
  {
    name: "Billing",
    path: "/dashboard/billing",
    icon: CreditCard,
  },
];

const DashboardNav = () => {
  const activePathname = usePathname();
  return (
    <nav className="grid items-start gap-2">
      {navItems.map((navItem) => (
        <Link href={navItem.path} key={navItem.path}>
          <span
            className={cn(
              "group flex items-center rounded-md py-2 px-23 text-sm gap-2 hover:bg-accent hover:text-accent-foreground",
              activePathname === navItem.path ? "bg-accent" : " bg-transparent"
            )}
          >
            <navItem.icon className="size-4 mr-2 ml-1 text-primary" />

            <span>{navItem.name}</span>
          </span>
        </Link>
      ))}
    </nav>
  );
};

export default DashboardNav;
