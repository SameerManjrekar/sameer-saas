"use client";

import { Loader2, Plus, Trash } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <div>
      {pending ? (
        <Button type="submit">
          <>
            <Loader2 className="size-4 mr-2 animate-spin" />
            Creating Subscription....
          </>
        </Button>
      ) : (
        <Button>Create Subscription</Button>
      )}
    </div>
  );
};

export default SubmitButton;

export function DeleteNoteButton() {
  const { pending } = useFormStatus();
  return (
    <div>
      {pending ? (
        <Button type="submit">
          <>
            <Loader2 className="size-4 mr-2 animate-spin" />
          </>
        </Button>
      ) : (
        <Button>
          <Trash className="size-4" />
        </Button>
      )}
    </div>
  );
}
