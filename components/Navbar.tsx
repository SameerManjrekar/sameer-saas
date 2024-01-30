import Link from "next/link";
import { Button } from "./ui/button";
import { UserButton, auth, currentUser } from "@clerk/nextjs";
import { ThemeToggler } from "./ThemeToggler";

const Navbar = () => {
  const { userId } = auth();
  return (
    <header className="flex items-center border-b h-[10vh] justify-between">
      <Link href="/">
        <h2 className="text-3xl sm:text-4xl font-bold">
          <span className="text-primary">Sameer</span>
          <span className="bg-background">SaaS</span>
        </h2>
      </Link>
      <div className="flex items-center gap-x-6">
        <ThemeToggler />
        {!userId && (
          <Link href="/sign-in">
            <Button>Sign In</Button>
          </Link>
        )}
        {!userId && (
          <Link href="/sign-up">
            <Button variant="secondary">Sign Up</Button>
          </Link>
        )}
        {userId && <UserButton afterSignOutUrl="/" />}
      </div>
    </header>
  );
};

export default Navbar;
