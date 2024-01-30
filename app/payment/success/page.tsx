import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";

const SuccessPage = () => {
  return (
    <div className="w-full h-[80vh] flex items-center justify-center">
      <Card className="w-[350px]">
        <div className="p-6">
          <div className="w-full justify-center flex">
            <Check className="size-12 bg-green-500/30 text-green-500 rounded-full" />
          </div>
          <div className="mt-3 text-center sm:mt-5 w-full">
            <h3 className="text-lg font-medium leading-6">
              Payment Successful
            </h3>
          </div>
          <div className="mt-2 text-center">
            <p className="text-sm text-muted-foreground">
              Congratulations, you have subscribed to our monthly subscription
              plan
            </p>
          </div>
          <div className="mt-5 sm:mt-6 w-full">
            <Button className="w-full" asChild>
              <Link href="/dashboard">Go back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SuccessPage;
