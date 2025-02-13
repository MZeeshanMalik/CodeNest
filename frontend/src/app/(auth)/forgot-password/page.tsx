/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/UI/input";
import { Button } from "@/components/UI/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { Label } from "@/components/UI/label";
import { cn } from "@/lib/utils";
import { SyncLoader } from "react-spinners";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useAuthFogotPass } from "@/hooks/useAuth";
import { useState } from "react";

// Define the schema for email validation
const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type EmailFormValues = z.infer<typeof emailSchema>;

export default function EmailForm() {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const forgoPassMutation = useAuthFogotPass();

  const onSubmit = async (data: EmailFormValues) => {
    setIsSubmitting(true);
    forgoPassMutation.mutate(data.email, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "✅ Email sent successfully!",
          variant: "success",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Email not sent!",
          variant: "destructive",
        });
      },
    });
    setIsSubmitting(false);
  };

  return (
    <div className="flex items-center justify-center bg-gray-200 p-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl bg-white">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold">
            Verify Email To Reset Your Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                className={cn(errors.email && "border-red-500")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-btnColor hover:bg-btnHoverCol"
              disabled={isSubmitting}
            >
              {isSubmitting ? <SyncLoader color="#f1f3f2" /> : "Verify Email"}
            </Button>
          </form>
          <div>
            <p className="mt-4 text-center">
              Need help?{" "}
              <a href="/support" className="text-btnColor hover:underline">
                Contact support
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
