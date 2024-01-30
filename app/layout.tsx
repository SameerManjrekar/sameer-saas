import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ClerkProvider, auth } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import { getColorScheme } from "@/actions/getColorScheme";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sameer SaaS App",
  description:
    "This is Sameer SaaS Example created using Nect js 14, ShadCN UI, Stripe, PostgreSQL",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = auth();

  const data = await getColorScheme(userId as string);
  return (
    <html lang="en">
      <ClerkProvider>
        <body
          className={`${inter.className} ${
            data?.colorScheme ?? "theme-orange"
          }`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Container>
              <main>
                <Navbar />
                {children}
              </main>
              <Toaster />
            </Container>
          </ThemeProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}
