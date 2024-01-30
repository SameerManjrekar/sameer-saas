"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "./ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { Button } from "./ui/button";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "./ui/use-toast";
import { addNote, updateNote } from "@/actions/addNote";
import { Edit, Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Note } from "@prisma/client";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
});

type NoteFormProps = {
  userId: string;
  data?: Note;
};

const NoteForm = ({ userId, data }: NoteFormProps) => {
  const [pending, setPending] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: data || {
      title: "",
      description: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setPending(true);
    if (!userId) {
      return toast({
        variant: "destructive",
        description: "User is not authenticated",
      });
    }

    if (!data) {
      const response = await addNote(userId, values.title, values.description);
      if (!response) {
        setPending(false);
        toast({
          variant: "destructive",
          description: "Error in Note addition. Please try again!",
        });
      }
      if (response) {
        setPending(false);
        toast({
          variant: "success",
          description: "Note added successfully!",
        });
        return router.push("/dashboard");
      }
    } else {
      const response = await updateNote(
        values.title as string,
        values.description as string,
        data.id as string,
        data.userId as string
      );
      console.log("response", { values, data, userId });
      if (!response) {
        setPending(false);
        toast({
          variant: "destructive",
          description: "Error in Note editing. Please try again!",
        });
      }
      if (response) {
        setPending(false);
        toast({
          variant: "success",
          description: "Note updated successfully!",
        });
        return router.push("/dashboard");
      }
    }
  };

  return (
    <Card className="w-[800px]">
      <CardHeader>
        <h2 className="text-2xl sm:text-3xl font-bold">Notes Form</h2>
        <CardDescription>
          Right here you can now create or update notes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-8 mb-2">
            <div className="w-full">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Title</FormLabel>
                    <FormDescription>Title for Note</FormDescription>
                    <FormControl>
                      <Input placeholder="Title for Note" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Description</FormLabel>
                    <FormDescription>Description for Note</FormDescription>
                    <FormControl>
                      <SimpleMDE
                        className="dark:bg-gray-900"
                        placeholder="Description of Note"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <Button variant="outline" asChild>
          <Link href="/dashboard">Cancel</Link>
        </Button>
        {pending ? (
          <Button type="submit">
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              {!data ? "Creating Note...." : "Updating Note..."}
            </>
          </Button>
        ) : (
          <Button onClick={form.handleSubmit(onSubmit)}>
            {!data ? (
              <>
                <Plus className="size-4 mr-2" />
                Add Note
              </>
            ) : (
              <>
                <Edit className="size-4 mr-2" />
                Update Note
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default NoteForm;
