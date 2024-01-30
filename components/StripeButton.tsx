"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

const StripeButton = () => {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button className="w-fit" type="submit">
          <>
            <Loader2 className="size-4 mr-2 animate-spin" />
            Please Wait...
          </>
        </Button>
      ) : (
        <Button className="w-fit" type="submit">
          View Payment details
        </Button>
      )}
    </>
  );
};

export default StripeButton;
