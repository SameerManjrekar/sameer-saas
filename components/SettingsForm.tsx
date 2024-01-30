"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { updateUser } from "@/actions/updateData";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().optional(),
  colorScheme: z.string().min(1, { message: "Color Scheme is required" }),
});

type User = {
  name: string;
  email: string;
  colorScheme: string;
};

type SettingsFormProps = {
  data: User;
  userId: string;
};

const SettingsForm = ({ data, userId }: SettingsFormProps) => {
  const [pending, setPending] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: data || {
      name: "",
      email: "",
      colorScheme: "",
    },
  });
  const { toast } = useToast();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setPending(true);
    if (!userId) {
      return toast({
        variant: "destructive",
        description: "User is not authenticated",
      });
    }
    const response = await updateUser(
      userId as string,
      values.name,
      values.colorScheme
    );
    if (response) {
      setPending(false);
      return toast({
        variant: "success",
        description: "User Data Updated successfully!",
      });
    }
  };

  return (
    <Card className="w-[700px]">
      <CardHeader>Settings Form</CardHeader>
      <CardDescription className="px-5">
        Please update your name and color scheme
      </CardDescription>
      <CardContent>
        <Form {...form}>
          <form className="space-y-8">
            <div className="grid w-full items-center gap-4">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="mt-3">
                    <FormLabel htmlFor="name">Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Your Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Email address" readOnly className="bg-gray-700/10 cursor-not-allowed"/>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="colorScheme"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="colorScheme">Color Scheme</FormLabel>
                    <FormControl>
                      <Select
                        // onChange={field.value as string}
                        defaultValue={data?.colorScheme ?? ""}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Color Scheme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Color Scheme</SelectLabel>
                            <SelectItem value="theme-orange">Orange</SelectItem>
                            <SelectItem value="theme-green">Green</SelectItem>
                            <SelectItem value="theme-red">Red</SelectItem>
                            <SelectItem value="theme-rose">Rose</SelectItem>
                            <SelectItem value="theme-yellow">Yellow</SelectItem>
                            <SelectItem value="theme-violet">Violet</SelectItem>
                            <SelectItem value="theme-blue">Blue</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button onClick={form.handleSubmit(onSubmit)}>
          {pending ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              Saving User Data
            </>
          ) : (
            "Save Now"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SettingsForm;
