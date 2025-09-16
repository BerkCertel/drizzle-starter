"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createUser, updateUser } from "@/server/users";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { User } from "@/db/schema";
import { DialogClose } from "../ui/dialog";

interface UserFormProps {
  user: User;
}

const formSchema = z.object({
  username: z.string().min(2).max(50),
  email: z.email(),
});

export default function UserForm({ user }: UserFormProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const userData = { ...values, password: "123456" };

      if (user) {
        await updateUser({ ...userData, id: user.id });
      } else {
        await createUser(userData);
      }

      form.reset();
      toast.success(`User ${user ? "updated" : "created"} successfully.`);
      router.refresh();
    } catch (error) {
      toast.error(
        `User ${user ? "updated" : "create"} failed. Please try again.`
      );
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter your username" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="animate-spin" />
                <span>{user ? "Updating..." : "Creating..."}</span>
              </div>
            ) : (
              <span>{user ? "Update User" : "Create User"}</span>
            )}
          </Button>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </div>
      </form>
    </Form>
  );
}
